import compression from 'compression';

export default function configureCompression(app: any) {
  // Comprimir respuestas en gzip
  app.use(compression({
    level: 6,
    threshold: 1024 * 10, // 10KB mínimo
  }));
}
