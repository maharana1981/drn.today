import { S3 } from 'aws-sdk'

const s3 = new S3({
  accessKeyId: process.env.WASABI_KEY,
  secretAccessKey: process.env.WASABI_SECRET,
  endpoint: process.env.WASABI_ENDPOINT,
  region: process.env.WASABI_REGION,
  signatureVersion: 'v4',
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  const { fileName, fileType } = req.body
  if (!fileName || !fileType) return res.status(400).json({ error: 'Missing fields' })

  const s3Params = {
    Bucket: process.env.WASABI_BUCKET,
    Key: `uploads/${Date.now()}-${fileName}`,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  }

  try {
    const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params)
    res.status(200).json({
      uploadUrl,
      fileUrl: `${process.env.WASABI_ENDPOINT}/${process.env.WASABI_BUCKET}/${s3Params.Key}`,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate URL' })
  }
}
