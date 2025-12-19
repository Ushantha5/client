import { useState, useEffect } from 'react';

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unavailable' | 'unsupported';

export interface PermissionState {
  location: PermissionStatus;
  camera: PermissionStatus;
  microphone: PermissionStatus;
  speaker: PermissionStatus;
  notifications: PermissionStatus;
  autoplay: PermissionStatus;
  vr: PermissionStatus;
  clipboard: PermissionStatus;
  screenCapture: PermissionStatus;
}

export interface PermissionErrors {
  location?: string;
  camera?: string;
  microphone?: string;
  speaker?: string;
  notifications?: string;
  autoplay?: string;
  vr?: string;
  clipboard?: string;
  screenCapture?: string;
}

const defaultPermissionState: PermissionState = {
  location: 'prompt',
  camera: 'prompt',
  microphone: 'prompt',
  speaker: 'prompt',
  notifications: 'prompt',
  autoplay: 'prompt',
  vr: 'prompt',
  clipboard: 'prompt',
  screenCapture: 'prompt',
};

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<PermissionState>(defaultPermissionState);
  const [errors, setErrors] = useState<PermissionErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Check current permission status
  const checkPermissionStatus = async (name: string): Promise<PermissionStatus> => {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      return 'unsupported';
    }

    try {
      const permission = await navigator.permissions.query({ name } as any);
      return permission.state as PermissionStatus;
    } catch (error) {
      return 'unavailable';
    }
  };

  // Initialize permission statuses
  useEffect(() => {
    const initializePermissions = async () => {
      const updatedPermissions: PermissionState = { ...defaultPermissionState };

      // Check available permissions
      updatedPermissions.location = await checkPermissionStatus('geolocation');
      updatedPermissions.camera = await checkPermissionStatus('camera');
      updatedPermissions.microphone = await checkPermissionStatus('microphone');
      updatedPermissions.speaker = await checkPermissionStatus('speaker');
      updatedPermissions.notifications = await checkPermissionStatus('notifications');
      updatedPermissions.autoplay = await checkPermissionStatus('autoplay');

      // VR permission check (if available)
      try {
        updatedPermissions.vr = await checkPermissionStatus('xr');
      } catch {
        updatedPermissions.vr = 'unsupported';
      }

      setPermissions(updatedPermissions);
    };

    initializePermissions();
  }, []);

  // Request all permissions at once
  const requestAllPermissions = async () => {
    setLoading(true);
    setErrors({});

    const newPermissions: PermissionState = { ...permissions };
    const newErrors: PermissionErrors = {};

    try {
      // Request geolocation
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              newPermissions.location = 'granted';
              resolve(null);
            },
            (error) => {
              newPermissions.location = 'denied';
              newErrors.location = error.message;
              reject(error);
            }
          );
        });
      } catch (error: any) {
        newPermissions.location = 'denied';
        newErrors.location = error.message;
      }

      // Request camera and microphone (combined)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        newPermissions.camera = 'granted';
        newPermissions.microphone = 'granted';

        // Stop tracks to release devices
        stream.getTracks().forEach(track => track.stop());
      } catch (error: any) {
        newPermissions.camera = 'denied';
        newPermissions.microphone = 'denied';
        newErrors.camera = error.message;
        newErrors.microphone = error.message;
      }

      // Request notifications
      try {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          newPermissions.notifications = permission as PermissionStatus;
        } else {
          newPermissions.notifications = 'unsupported';
        }
      } catch (error: any) {
        newPermissions.notifications = 'denied';
        newErrors.notifications = error.message;
      }

      // Request clipboard access (if available)
      try {
        if ('clipboard' in navigator) {
          // Just check if we can read (this will prompt if needed)
          await navigator.clipboard.readText();
          newPermissions.clipboard = 'granted';
        } else {
          newPermissions.clipboard = 'unsupported';
        }
      } catch (error: any) {
        newPermissions.clipboard = 'denied';
        newErrors.clipboard = error.message;
      }

      // Speaker selection is typically handled through media devices
      try {
        if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
          await navigator.mediaDevices.enumerateDevices();
          newPermissions.speaker = 'granted';
        } else {
          newPermissions.speaker = 'unsupported';
        }
      } catch (error: any) {
        newPermissions.speaker = 'denied';
        newErrors.speaker = error.message;
      }

      // Set all states
      setPermissions(newPermissions);
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  // Request individual permission
  const requestPermission = async (permission: keyof PermissionState) => {
    setLoading(true);

    try {
      switch (permission) {
        case 'location':
          return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              () => {
                setPermissions(prev => ({ ...prev, location: 'granted' }));
                resolve(null);
              },
              (error) => {
                setPermissions(prev => ({ ...prev, location: 'denied' }));
                setErrors(prev => ({ ...prev, location: error.message }));
                reject(error);
              }
            );
          });

        case 'camera':
        case 'microphone': {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: permission === 'camera' || permission === 'microphone',
            audio: permission === 'microphone' || permission === 'camera'
          });

          if (permission === 'camera') {
            setPermissions(prev => ({ ...prev, camera: 'granted' }));
          } else {
            setPermissions(prev => ({ ...prev, microphone: 'granted' }));
          }

          // Stop tracks to release devices
          stream.getTracks().forEach(track => track.stop());
          break;
        }

        case 'notifications':
          if ('Notification' in window) {
            const result = await Notification.requestPermission();
            setPermissions(prev => ({ ...prev, notifications: result as PermissionStatus }));
          } else {
            setPermissions(prev => ({ ...prev, notifications: 'unsupported' }));
          }
          break;

        default: {
          // For other permissions, we can only check status
          const status = await checkPermissionStatus(permission);
          setPermissions(prev => ({ ...prev, [permission]: status }));
          break;
        }
      }
    } catch (error: any) {
      setPermissions(prev => ({ ...prev, [permission]: 'denied' }));
      setErrors(prev => ({ ...prev, [permission]: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return {
    permissions,
    errors,
    loading,
    requestAllPermissions,
    requestPermission,
  };
};