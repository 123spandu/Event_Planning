import multer from 'multer';

export function notFound(req, res) {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller.' : err.message;
    return res.status(422).json({ message });
  }
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'An item with this slug already exists.' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON body.' });
  if (err.message?.startsWith('Not allowed by CORS')) return res.status(403).json({ message: err.message });

  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 ? 'Something went wrong on our side. Please try again.' : err.message });
}

/** Wrap async route handlers so rejections reach the error handler. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
