import chalk from "chalk";

// Enhanced logger utility with emojis and JSON formatting
export class Logger {
  static formatData(data, maxDepth = 4) {
    if (data === null || data === undefined) {
      return chalk.gray('null/undefined');
    }
    
    if (typeof data === 'string') {
      return chalk.white(`"${data}"`);
    }
    
    if (typeof data === 'number' || typeof data === 'boolean') {
      return chalk.cyan(data.toString());
    }
    
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return chalk.gray('[]');
      }
      return chalk.yellow(`Array(${data.length})`) + '\n' + 
        JSON.stringify(data, null, 2).split('\n').map(line => '  ' + line).join('\n');
    }
    
    if (typeof data === 'object') {
      const keys = Object.keys(data);
      if (keys.length === 0) {
        return chalk.gray('{}');
      }
      return chalk.blue(`Object(${keys.length} keys)`) + '\n' + 
        JSON.stringify(data, null, 2).split('\n').map(line => '  ' + line).join('\n');
    }
    
    return chalk.white(String(data));
  }

  static info(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(chalk.blue('ℹ️  INFO') + chalk.gray(` [${timestamp}] `) + chalk.white(message));
    if (data !== null) {
      console.log(this.formatData(data));
    }
    console.log(chalk.gray('─'.repeat(50)));
  }

  static success(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(chalk.green('✅ SUCCESS') + chalk.gray(` [${timestamp}] `) + chalk.white(message));
    if (data !== null) {
      console.log(this.formatData(data));
    }
    console.log(chalk.gray('─'.repeat(50)));
  }

  static warning(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(chalk.yellow('⚠️  WARNING') + chalk.gray(` [${timestamp}] `) + chalk.white(message));
    if (data !== null) {
      console.log(this.formatData(data));
    }
    console.log(chalk.gray('─'.repeat(50)));
  }

  static error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.log(chalk.red('❌ ERROR') + chalk.gray(` [${timestamp}] `) + chalk.white(message));
    if (error) {
      if (error.stack) {
        console.log(chalk.red('Stack Trace:'));
        console.log(chalk.red(error.stack));
      } else {
        console.log(this.formatData(error));
      }
    }
    console.log(chalk.gray('─'.repeat(50)));
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(chalk.magenta('🐛 DEBUG') + chalk.gray(` [${timestamp}] `) + chalk.white(message));
      if (data !== null) {
        console.log(this.formatData(data));
      }
      console.log(chalk.gray('─'.repeat(50)));
    }
  }

  static request(method, url, headers = {}, body = null) {
    const timestamp = new Date().toISOString();
    console.log(chalk.cyan('📥 REQUEST') + chalk.gray(` [${timestamp}] `) + chalk.white(`${method} ${url}`));
    
    if (Object.keys(headers).length > 0) {
      console.log(chalk.cyan('Headers:'));
      console.log(this.formatData(headers));
    }
    
    if (body) {
      console.log(chalk.cyan('Body:'));
      console.log(this.formatData(body));
    }
    console.log(chalk.gray('─'.repeat(50)));
  }

  static response(statusCode, data = null, duration = null) {
    const timestamp = new Date().toISOString();
    const statusEmoji = statusCode >= 200 && statusCode < 300 ? '✅' : 
                       statusCode >= 400 ? '❌' : '⚠️';
    const statusColor = statusCode >= 200 && statusCode < 300 ? chalk.green : 
                       statusCode >= 400 ? chalk.red : chalk.yellow;
    
    console.log(chalk.blue('📤 RESPONSE') + chalk.gray(` [${timestamp}] `) + 
               statusColor(`${statusEmoji} ${statusCode}`) + 
               (duration ? chalk.gray(` (${duration}ms)`) : ''));
    
    if (data) {
      console.log(this.formatData(data));
    }
    console.log(chalk.gray('─'.repeat(50)));
  }

  static database(operation, collection, data = null, result = null) {
    const timestamp = new Date().toISOString();
    console.log(chalk.magenta('🗄️  DATABASE') + chalk.gray(` [${timestamp}] `) + 
               chalk.white(`${operation.toUpperCase()} on ${collection}`));
    
    if (data) {
      console.log(chalk.magenta('Query/Data:'));
      console.log(this.formatData(data));
    }
    
    if (result) {
      console.log(chalk.magenta('Result:'));
      console.log(this.formatData(result));
    }
    console.log(chalk.gray('─'.repeat(50)));
  }

  static auth(action, user = null, success = true) {
    const timestamp = new Date().toISOString();
    const emoji = success ? '🔐' : '🚫';
    const color = success ? chalk.green : chalk.red;
    
    console.log(color(`${emoji} AUTH`) + chalk.gray(` [${timestamp}] `) + chalk.white(action));
    
    if (user) {
      console.log(this.formatData({
        userId: user._id || user.id,
        email: user.email,
        role: user.role
      }));
    }
    console.log(chalk.gray('─'.repeat(50)));
  }

  static apiCall(url, method, statusCode, duration = null) {
    const timestamp = new Date().toISOString();
    const statusEmoji = statusCode >= 200 && statusCode < 300 ? '🌐' : '💥';
    const statusColor = statusCode >= 200 && statusCode < 300 ? chalk.green : chalk.red;
    
    console.log(chalk.blue('🌐 API CALL') + chalk.gray(` [${timestamp}] `) + 
               chalk.white(`${method} ${url}`) + ' ' + 
               statusColor(`${statusEmoji} ${statusCode}`) + 
               (duration ? chalk.gray(` (${duration}ms)`) : ''));
    console.log(chalk.gray('─'.repeat(50)));
  }
}

export default Logger;

