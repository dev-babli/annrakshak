import { NextRequest, NextResponse } from 'next/server'
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

// Serial port configuration
const SERIAL_PORT = process.env.ARDUINO_SERIAL_PORT || 'COM3' // Windows default, change for Linux/Mac
const BAUD_RATE = 9600

// Global serial port instance (reuse connection)
let serialPort: SerialPort | null = null

// Initialize serial connection
async function initializeSerialPort(): Promise<SerialPort> {
  if (serialPort && serialPort.isOpen) {
    return serialPort
  }

  try {
    serialPort = new SerialPort({
      path: SERIAL_PORT,
      baudRate: BAUD_RATE,
      autoOpen: false
    })

    return new Promise((resolve, reject) => {
      serialPort!.open((err) => {
        if (err) {
          console.error('Failed to open serial port:', err)
          reject(err)
        } else {
          console.log(`✅ Serial port ${SERIAL_PORT} opened successfully`)
          resolve(serialPort!)
        }
      })
    })
  } catch (error) {
    console.error('Serial port initialization error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { time } = body

    // Validate input
    if (typeof time !== 'number' || time < 0 || time > 60) {
      return NextResponse.json(
        { error: 'Invalid time value. Must be a number between 0 and 60 seconds.' },
        { status: 400 }
      )
    }

    // Initialize serial port
    const port = await initializeSerialPort()

    // Create command string
    const command = `RUN:${Math.round(time)}\n`
    
    console.log(`🌿 Sending command to Arduino: ${command.trim()}`)

    // Send command to Arduino
    return new Promise((resolve, reject) => {
      port.write(command, (err) => {
        if (err) {
          console.error('Failed to write to serial port:', err)
          reject(NextResponse.json(
            { error: 'Failed to send command to Arduino' },
            { status: 500 }
          ))
        } else {
          console.log(`✅ Command sent successfully: ${command.trim()}`)
          
          // Wait a moment for Arduino to process
          setTimeout(() => {
            resolve(NextResponse.json({
              success: true,
              message: `Motor command sent: run for ${time} seconds`,
              command: command.trim(),
              timestamp: new Date().toISOString()
            }))
          }, 100)
        }
      })
    })

  } catch (error) {
    console.error('Run motor error:', error)
    
    // Handle serial port errors gracefully
    if (error instanceof Error && error.message.includes('serial')) {
      return NextResponse.json(
        { 
          error: 'Serial communication failed. Please check Arduino connection.',
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to run motor' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    const port = await initializeSerialPort()
    
    return NextResponse.json({
      status: 'connected',
      port: SERIAL_PORT,
      baudRate: BAUD_RATE,
      isOpen: port.isOpen,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'disconnected',
        error: 'Serial port not available',
        port: SERIAL_PORT,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}
