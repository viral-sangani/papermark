import { NextApiRequest, NextApiResponse } from "next";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth/next";
import path from "node:path";

import { randomUUID } from "node:crypto";

import { ONE_HOUR, ONE_SECOND } from "@/lib/constants";
import { getStorageConfig } from "@/ee/features/storage/config";
import { getS3Client } from "@/lib/files/aws-client";
import { CustomUser } from "@/lib/types";
import { safeSlugify } from "@/lib/utils";

import { authOptions } from "../auth/[...nextauth]";

// Public bucket for branding / avatar / link-preview images. Unlike documents
// (which live in the private bucket and are served via presigned GET URLs),
// these assets are rendered with a plain <img src> on public viewer pages, so
// they must be anonymously readable. The bucket has a download-only anonymous
// policy; uploads still go through this auth-gated presigned-POST endpoint.
const getPublicBucket = () =>
  process.env.NEXT_PRIVATE_UPLOAD_PUBLIC_BUCKET || "papermark-public";

const uploadConfig = {
  profile: {
    allowedContentTypes: ["image/png", "image/jpeg", "image/jpg"],
    maximumSizeInBytes: 2 * 1024 * 1024, // 2MB
  },
  assets: {
    allowedContentTypes: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/x-icon",
      "image/ico",
      "image/vnd.microsoft.icon",
    ],
    maximumSizeInBytes: 5 * 1024 * 1024, // 5MB
  },
};

/**
 * Issues a presigned PUT URL for uploading a public image asset to the public
 * S3/MinIO bucket. Self-hosted (NEXT_PUBLIC_UPLOAD_TRANSPORT=s3) replacement for
 * the Vercel Blob image-upload flow. The client uploads the blob directly to the
 * returned URL and then stores the public object URL.
 *
 * type: "profile" | "assets"  (controls allowed content types / max size)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  if (process.env.NEXT_PUBLIC_UPLOAD_TRANSPORT !== "s3") {
    return res
      .status(400)
      .json({ error: "S3 image upload is not enabled on this deployment." });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const type = Array.isArray(req.query.type)
    ? req.query.type[0]
    : req.query.type;
  if (!type || !(type in uploadConfig)) {
    return res.status(400).json({ error: "Invalid upload type specified." });
  }
  const cfg = uploadConfig[type as keyof typeof uploadConfig];

  const { fileName, contentType } = req.body as {
    fileName?: string;
    contentType?: string;
  };

  if (!fileName || !contentType) {
    return res
      .status(400)
      .json({ error: "fileName and contentType are required." });
  }

  if (!cfg.allowedContentTypes.includes(contentType)) {
    return res
      .status(400)
      .json({ error: `Content type "${contentType}" is not allowed.` });
  }

  try {
    const userId = (session.user as CustomUser).id;
    const { name, ext } = path.parse(fileName);
    // Random id keeps uploads from colliding and avoids leaking original names.
    const objectId = randomUUID();
    const slugifiedName = `${safeSlugify(name) || "image"}${ext}`;
    // Namespace by type + user so it's easy to reason about / clean up later.
    const key = `${type}/${userId}/${objectId}/${slugifiedName}`;

    const client = getS3Client();
    const config = getStorageConfig();
    const bucket = getPublicBucket();

    const putObjectCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(client, putObjectCommand, {
      expiresIn: ONE_HOUR / ONE_SECOND,
    });

    // Public URL the browser will load directly. Prefer the configured endpoint
    // (e.g. https://s3.dataroom.cesto.co); path-style: <endpoint>/<bucket>/<key>.
    const endpoint = config.endpoint?.replace(/\/+$/, "");
    if (!endpoint) {
      return res.status(500).json({
        error:
          "NEXT_PRIVATE_UPLOAD_ENDPOINT is required to build public asset URLs.",
      });
    }
    const publicUrl = `${endpoint}/${bucket}/${key}`;

    return res.status(200).json({ uploadUrl, publicUrl, key, contentType });
  } catch (error) {
    console.error("image-upload-s3 presign error:", error);
    return res.status(500).json({ error: "Failed to prepare image upload." });
  }
}
