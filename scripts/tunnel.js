import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// Locate cloudflared binary
const localBin = path.join(rootDir, 'bin', 'cloudflared.exe')
let cloudflaredCmd = 'cloudflared'

if (fs.existsSync(localBin)) {
  cloudflaredCmd = localBin
}

console.log('\n======================================================================')
console.log('  ANTARA - CLOUDFLARE QUICK TUNNEL STARTER')
console.log('======================================================================')
console.log(`Using binary: ${cloudflaredCmd}`)
console.log('Starting Cloudflare tunnel to http://127.0.0.1:5173 ...\n')

const tunnelProcess = spawn(cloudflaredCmd, ['tunnel', '--url', 'http://127.0.0.1:5173'], {
  stdio: ['ignore', 'pipe', 'pipe'],
})

let tunnelUrl = ''

function handleOutput(data) {
  const text = data.toString()

  // Match https://[subdomain].trycloudflare.com
  const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/)
  if (match && !tunnelUrl) {
    tunnelUrl = match[0]
    
    // Save to file for easy access
    try {
      fs.writeFileSync(path.join(rootDir, 'tunnel-url.txt'), tunnelUrl, 'utf8')
    } catch {
      // Ignore file write error
    }

    console.log('\n======================================================================')
    console.log('  PUBLIC TUNNEL URL IS READY!')
    console.log('======================================================================')
    console.log(`  Public Website:   ${tunnelUrl}`)
    console.log(`  Admin Console:    ${tunnelUrl}/adminpanel`)
    console.log(`  Local Forward:    http://127.0.0.1:5173`)
    console.log('======================================================================')
    console.log('  Share this public HTTPS link with clients or team members anywhere.')
    console.log('  Press Ctrl+C to close the tunnel.\n')
  }

  // Print connection notices if error occurs
  if (text.includes('ERR') || text.includes('failed to connect')) {
    process.stderr.write(text)
  }
}

tunnelProcess.stdout.on('data', handleOutput)
tunnelProcess.stderr.on('data', handleOutput)

tunnelProcess.on('error', (err) => {
  console.error('\n[Error] Failed to start cloudflared:', err.message)
  console.log('\nIf cloudflared is missing, ensure bin/cloudflared.exe exists or install it via:')
  console.log('  winget install --id Cloudflare.cloudflared\n')
  process.exit(1)
})

tunnelProcess.on('close', (code) => {
  console.log(`\nCloudflare tunnel process terminated (exit code ${code}).`)
  process.exit(code || 0)
})

// Graceful cleanup
function cleanup() {
  if (tunnelProcess && !tunnelProcess.killed) {
    tunnelProcess.kill('SIGINT')
  }
}

process.on('SIGINT', () => {
  cleanup()
  process.exit(0)
})

process.on('SIGTERM', () => {
  cleanup()
  process.exit(0)
})

