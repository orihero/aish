import chalk from 'chalk';

function formatHeaders(headers) {
  return Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n    ');
}

function formatBody(body) {
  if (!body) return 'No body';
  try {
    return JSON.stringify(body, null, 2);
  } catch (error) {
    return body;
  }
}

export const requestLogger = (req, res, next) => {
  // Store original send
  const originalSend = res.send;
  
  // Get request time
  const startTime = Date.now();

  // Log request
  console.log('\n' + chalk.yellow('⟶ REQUEST ') + chalk.gray(new Date().toISOString()));
  console.log(chalk.yellow('URL: ') + `${req.method} ${req.originalUrl}`);
  console.log(chalk.yellow('Headers:\n    ') + formatHeaders(req.headers));
  console.log(chalk.yellow('Body:\n') + chalk.white(formatBody(req.body)));

  // Override send
  res.send = function (body) {
    // Log response
    const duration = Date.now() - startTime;
    console.log('\n' + chalk.green('⟵ RESPONSE ') + chalk.gray(`${duration}ms`));
    console.log(chalk.green('Status: ') + res.statusCode);
    console.log(chalk.green('Headers:\n    ') + formatHeaders(res.getHeaders()));
    console.log(chalk.green('Body:\n') + chalk.white(formatBody(body)));
    console.log(chalk.gray('──────────────────────────────────────'));

    // Restore original send
    res.send = originalSend;
    return originalSend.call(this, body);
  };

  next();
};