import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zone_id = 'default', duration = 2000 } = body
    
    // ESP32 Configuration
    const ESP32_IP = process.env.ESP32_IP || '192.168.1.100' // Change this to your ESP32's IP
    const ESP32_PORT = process.env.ESP32_PORT || '80'
    
    // For demo purposes, we'll simulate the spray command
    // In production, you would send HTTP request to ESP32
    console.log(`🌿 Triggering spray for zone: ${zone_id}, duration: ${duration}ms`)
    
    // Simulate ESP32 communication
    const sprayCommand = {
      command: 'SPRAY',
      zone_id,
      duration,
      timestamp: new Date().toISOString()
    }
    
    // In a real implementation, you would:
    // const response = await fetch(`http://${ESP32_IP}:${ESP32_PORT}/spray`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(sprayCommand)
    // })
    
    // For demo, we'll simulate a successful response
    const mockResponse = {
      success: true,
      message: 'Spray command sent successfully',
      zone_id,
      duration,
      estimated_completion: new Date(Date.now() + duration).toISOString()
    }
    
    // Log the spray event (you could save to database here)
    console.log('Spray event logged:', mockResponse)
    
    return NextResponse.json(mockResponse)
    
  } catch (error) {
    console.error('Spray trigger error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger spray' }, 
      { status: 500 }
    )
  }
}

// Alternative MQTT implementation (uncomment if using MQTT)
/*
import mqtt from 'mqtt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zone_id = 'default', duration = 2000 } = body
    
    // MQTT Configuration
    const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883'
    const MQTT_TOPIC = process.env.MQTT_TOPIC || 'sprayer/commands'
    
    // Connect to MQTT broker
    const client = mqtt.connect(MQTT_BROKER)
    
    return new Promise((resolve, reject) => {
      client.on('connect', () => {
        const sprayCommand = {
          command: 'SPRAY',
          zone_id,
          duration,
          timestamp: new Date().toISOString()
        }
        
        client.publish(MQTT_TOPIC, JSON.stringify(sprayCommand), (err) => {
          client.end()
          
          if (err) {
            reject(NextResponse.json({ error: 'Failed to publish spray command' }, { status: 500 }))
          } else {
            resolve(NextResponse.json({
              success: true,
              message: 'Spray command published successfully',
              zone_id,
              duration
            }))
          }
        })
      })
      
      client.on('error', (err) => {
        client.end()
        reject(NextResponse.json({ error: 'MQTT connection failed' }, { status: 500 }))
      })
    })
    
  } catch (error) {
    console.error('MQTT spray trigger error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger spray via MQTT' }, 
      { status: 500 }
    )
  }
}
*/
