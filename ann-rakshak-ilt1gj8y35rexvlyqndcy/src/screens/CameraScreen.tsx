import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function CameraScreen({ navigation }: any) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState(CameraType.back);
    const [flashMode, setFlashMode] = useState('off' as any);
    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        getCameraPermissions();
    }, []);

    const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                });

                // Navigate back to detection screen with the captured image
                navigation.navigate('Detection', { capturedImage: photo.uri });
            } catch (error) {
                console.error('Error taking picture:', error);
                Alert.alert('Error', 'Failed to take picture. Please try again.');
            }
        }
    };

    const toggleFlash = () => {
        setFlashMode(
            flashMode === 'off' ? 'on' : 'off'
        );
    };

    const flipCamera = () => {
        setType(
            type === CameraType.back ? CameraType.front : CameraType.back
        );
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No access to camera</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={getCameraPermissions}
                >
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                type={type}
                flashMode={flashMode}
                ref={cameraRef}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="close" size={24} color="#ffffff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Capture Plant Image</Text>

                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={flipCamera}
                    >
                        <Ionicons name="camera-reverse" size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>

                {/* Focus Frame */}
                <View style={styles.focusFrame}>
                    <View style={styles.focusCorner} />
                    <View style={[styles.focusCorner, styles.focusCornerTopRight]} />
                    <View style={[styles.focusCorner, styles.focusCornerBottomLeft]} />
                    <View style={[styles.focusCorner, styles.focusCornerBottomRight]} />
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsText}>
                        Position the plant leaf within the frame
                    </Text>
                    <Text style={styles.instructionsSubtext}>
                        Ensure good lighting and clear visibility
                    </Text>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={toggleFlash}
                    >
                        <Ionicons
                            name={flashMode === 'off' ? "flash-off" : "flash"}
                            size={24}
                            color="#ffffff"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                    >
                        <View style={styles.captureButtonInner} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => navigation.navigate('Detection')}
                    >
                        <Ionicons name="images" size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    camera: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    focusFrame: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 200,
        height: 200,
        marginTop: -100,
        marginLeft: -100,
    },
    focusCorner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#ffffff',
        borderWidth: 3,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        top: 0,
        left: 0,
    },
    focusCornerTopRight: {
        top: 0,
        right: 0,
        left: 'auto',
        borderLeftWidth: 0,
        borderRightWidth: 3,
    },
    focusCornerBottomLeft: {
        bottom: 0,
        top: 'auto',
        borderTopWidth: 0,
        borderBottomWidth: 3,
    },
    focusCornerBottomRight: {
        bottom: 0,
        right: 0,
        top: 'auto',
        left: 'auto',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 3,
        borderRightWidth: 3,
    },
    instructionsContainer: {
        position: 'absolute',
        top: 120,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    instructionsText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 4,
    },
    instructionsSubtext: {
        fontSize: 14,
        color: '#d1d5db',
        textAlign: 'center',
    },
    controls: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    controlButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#ffffff',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ffffff',
    },
    errorText: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#10b981',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
