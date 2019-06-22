const keys: string[] = [
  'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Accept-Datetime', 'Access-Control-Request-Method',
  'Access-Control-Request-Headers', 'Authorization', 'Cache-Control', 'Connection', 'Content-Length', 'Content-MD5',
  'Content-Type', 'Cookie', 'Date', 'Expect', 'Forwarded', 'From', 'Host', 'If-Match', 'If-Modified-Since',
  'If-None-Match', 'If-Range', 'If-Unmodified-Since', 'Max-Forwards', 'Origin', 'Pragma', 'Proxy-Authorization',
  'Range', 'Referer', 'TE', 'User-Agent', 'Upgrade', 'Via', 'Warning', 'Upgrade-Insecure-Requests', 'X-Requested-With',
  'DNT', 'X-Forwarded-For', 'X-Forwarded-Host', 'X-Forwarded-Proto', 'Front-End-Https', 'X-Http-Method-Override',
  'X-ATT-DeviceId', 'X-Wap-Profile', 'Proxy-Connection', 'X-UIDH', 'X-Csrf-Token', 'X-Request-ID', 'X-Correlation-ID', 'Save-Data'
];

const values: string[] = [
  'application/atom+xml', 'application/ecmascript', 'application/json', 'application/octet-stream', 'application/ogg',
  'application/pdf', 'application/postscript', 'application/rdf+xml', 'application/rss+xml', 'application/soap+xml',
  'application/font-woff', 'application/x-yaml', 'application/xhtml+xml', 'application/xml', 'application/xml-dtd',
  'application/xop+xml', 'application/zip', 'application/gzip', 'application/graphql', 'application/x-www-form-urlencoded',
  'image/gif', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'message/http',
  'message/imdn+xml', 'message/partial', 'message/rfc822', 'multipart/mixed', 'multipart/alternative',
  'multipart/related', 'multipart/form-data', 'multipart/signed', 'multipart/encrypted', 'text/cmd',
  'text/css', 'text/csv', 'text/html', 'text/plain', 'text/vcard', 'text/xml'
];

const HeadersList = {
  keys: keys,
  values: values
};

export { HeadersList };
