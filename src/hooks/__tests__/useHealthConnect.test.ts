import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useHealthConnect } from '../useHealthConnect';
import type { HcUpdatePayload } from '../../bridge/healthConnectBridge';

describe('useHealthConnect', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should start with connected=false and lastUpdate=null when no localStorage data', () => {
      const { result } = renderHook(() => useHealthConnect());
      
      expect(result.current.connected).toBe(false);
      expect(result.current.lastUpdate).toBeNull();
    });

    it('should restore lastUpdate from localStorage on mount', () => {
      const mockData: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: Date.now(),
        activity: { steps: 5000 },
      };
      
      localStorage.setItem('health_connect_last_update', JSON.stringify(mockData));
      
      const { result } = renderHook(() => useHealthConnect());
      
      expect(result.current.connected).toBe(false); // Never auto-connect
      expect(result.current.lastUpdate).toEqual(mockData);
    });

    it('should handle malformed localStorage data gracefully', () => {
      localStorage.setItem('health_connect_last_update', 'invalid-json');
      
      const { result } = renderHook(() => useHealthConnect());
      
      expect(result.current.connected).toBe(false);
      expect(result.current.lastUpdate).toBeNull();
    });
  });

  describe('Connect Flow', () => {
    it('should dispatch Android.requestHealthConnectPermissions on connect', () => {
      const mockAndroid = {
        requestHealthConnectPermissions: vi.fn(),
      };
      (window as any).Android = mockAndroid;

      const { result } = renderHook(() => useHealthConnect());

      act(() => {
        result.current.connect();
      });

      expect(mockAndroid.requestHealthConnectPermissions).toHaveBeenCalled();

      delete (window as any).Android;
    });

    it('should show alert when Android bridge not available', () => {
      const alertSpy = vi.spyOn(globalThis, 'alert');

      const { result } = renderHook(() => useHealthConnect());

      act(() => {
        result.current.connect();
      });

      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Health Connect bridge is not initialized')
      );

      alertSpy.mockRestore();
    });
  });

  describe('Event Handling', () => {
    it('should set connected=true and save data on hc-update event from health_connect', async () => {
      const { result } = renderHook(() => useHealthConnect());

      const mockPayload: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: Date.now(),
        activity: {
          activeCaloriesBurned: 1500,
          vo2Max: 45.5,
          steps: 8000,
        },
        vitals: {
          heartRate: 72,
        },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: mockPayload }));
      });

      await waitFor(() => {
        expect(result.current.connected).toBe(true);
        expect(result.current.lastUpdate).toEqual(mockPayload);
      });

      // Verify localStorage persistence
      const stored = localStorage.getItem('health_connect_last_update');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(mockPayload);
    });

    it('should set connected=true on debug event', async () => {
      const { result } = renderHook(() => useHealthConnect());

      const mockPayload: HcUpdatePayload = {
        source: 'debug',
        timestamp: Date.now(),
        activity: { steps: 1000 },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: mockPayload }));
      });

      await waitFor(() => {
        expect(result.current.connected).toBe(true);
        expect(result.current.lastUpdate).toEqual(mockPayload);
      });
    });

    it('should update lastUpdate when receiving multiple events', async () => {
      const { result } = renderHook(() => useHealthConnect());

      const payload1: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: 1000,
        activity: { steps: 5000 },
      };

      const payload2: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: 2000,
        activity: { steps: 10000 },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: payload1 }));
      });

      await waitFor(() => {
        expect(result.current.lastUpdate).toEqual(payload1);
      });

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: payload2 }));
      });

      await waitFor(() => {
        expect(result.current.lastUpdate).toEqual(payload2);
      });
    });
  });

  describe('Disconnect Flow', () => {
    it('should clear connected state and data on disconnect', async () => {
      const { result } = renderHook(() => useHealthConnect());

      // First, connect and receive data
      const mockPayload: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: Date.now(),
        activity: { steps: 5000 },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: mockPayload }));
      });

      await waitFor(() => {
        expect(result.current.connected).toBe(true);
      });

      // Then disconnect
      act(() => {
        result.current.disconnect();
      });

      expect(result.current.connected).toBe(false);
      expect(result.current.lastUpdate).toBeNull();
      expect(localStorage.getItem('health_connect_last_update')).toBeNull();
    });

    it('should handle disconnect when already disconnected', () => {
      const { result } = renderHook(() => useHealthConnect());

      expect(result.current.connected).toBe(false);

      act(() => {
        result.current.disconnect();
      });

      expect(result.current.connected).toBe(false);
      expect(result.current.lastUpdate).toBeNull();
    });
  });

  describe('localStorage Persistence', () => {
    it('should save data to localStorage on each update', async () => {
      const { result } = renderHook(() => useHealthConnect());

      const mockPayload: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: Date.now(),
        activity: {
          steps: 7500,
          activeCaloriesBurned: 1200,
        },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: mockPayload }));
      });

      await waitFor(() => {
        const stored = localStorage.getItem('health_connect_last_update');
        expect(stored).not.toBeNull();
        
        const parsed = JSON.parse(stored!);
        expect(parsed).toEqual(mockPayload);
      });
    });

    it('should clear localStorage on disconnect', async () => {
      const { result } = renderHook(() => useHealthConnect());

      // Setup data
      const mockPayload: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: Date.now(),
        activity: { steps: 5000 },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: mockPayload }));
      });

      await waitFor(() => {
        expect(localStorage.getItem('health_connect_last_update')).not.toBeNull();
      });

      // Disconnect
      act(() => {
        result.current.disconnect();
      });

      expect(localStorage.getItem('health_connect_last_update')).toBeNull();
    });

    it('should not persist connected state to localStorage', async () => {
      const { result } = renderHook(() => useHealthConnect());

      const mockPayload: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: Date.now(),
        activity: { steps: 5000 },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: mockPayload }));
      });

      await waitFor(() => {
        expect(result.current.connected).toBe(true);
      });

      // Verify localStorage doesn't have 'connected' key
      expect(localStorage.getItem('health_connect_connected')).toBeNull();
    });
  });

  describe('Reload/Remount Behavior', () => {
    it('should NOT auto-connect after remount even if data exists', async () => {
      // First mount - receive data
      const { unmount } = renderHook(() => useHealthConnect());

      const mockPayload: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: Date.now(),
        activity: { steps: 5000 },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: mockPayload }));
      });

      // Wait for localStorage to be updated
      await waitFor(() => {
        expect(localStorage.getItem('health_connect_last_update')).not.toBeNull();
      });

      // Unmount (simulating reload)
      unmount();

      // Remount
      const { result: newResult } = renderHook(() => useHealthConnect());

      // Should restore data but NOT connected state
      expect(newResult.current.connected).toBe(false);
      expect(newResult.current.lastUpdate).toEqual(mockPayload);
    });

    it('should allow reconnect after remount without re-requesting permissions', async () => {
      // Setup initial data
      const mockPayload: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: Date.now(),
        activity: { steps: 5000 },
      };

      localStorage.setItem('health_connect_last_update', JSON.stringify(mockPayload));

      // Mount after "reload"
      const { result } = renderHook(() => useHealthConnect());

      expect(result.current.connected).toBe(false);
      expect(result.current.lastUpdate).toEqual(mockPayload);

      // Reconnect
      act(() => {
        result.current.connect();
      });

      // Simulate new data from Health Connect (no permission dialog needed)
      const newPayload: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: Date.now() + 1000,
        activity: { steps: 6000 },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: newPayload }));
      });

      await waitFor(() => {
        expect(result.current.connected).toBe(true);
        expect(result.current.lastUpdate).toEqual(newPayload);
      });
    });
  });

  describe('Event Listener Cleanup', () => {
    it('should remove event listener on unmount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useHealthConnect());

      expect(addEventListenerSpy).toHaveBeenCalledWith('hc-update', expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('hc-update', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('should not create duplicate listeners on multiple mounts', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      // First mount
      const { unmount: unmount1 } = renderHook(() => useHealthConnect());
      
      const firstCallCount = addEventListenerSpy.mock.calls.length;

      // Second mount
      const { unmount: unmount2 } = renderHook(() => useHealthConnect());

      const secondCallCount = addEventListenerSpy.mock.calls.length;

      // Should have called addEventListener once per mount
      expect(secondCallCount).toBe(firstCallCount * 2);

      unmount1();
      unmount2();

      addEventListenerSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null payload gracefully', async () => {
      const { result } = renderHook(() => useHealthConnect());

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: null }));
      });

      // Should not crash or change state
      expect(result.current.connected).toBe(false);
      expect(result.current.lastUpdate).toBeNull();
    });

    it('should handle payload without source field', async () => {
      const { result } = renderHook(() => useHealthConnect());

      const invalidPayload: any = {
        timestamp: Date.now(),
        activity: { steps: 5000 },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: invalidPayload }));
      });

      // Should still work with default behavior
      await waitFor(() => {
        expect(result.current.lastUpdate).toEqual(invalidPayload);
      });
    });

    it('should handle very large payloads', async () => {
      const { result } = renderHook(() => useHealthConnect());

      const largePayload: HcUpdatePayload = {
        source: 'health_connect',
        timestamp: Date.now(),
        activity: {
          steps: 10000,
          activeCaloriesBurned: 2000,
          vo2Max: 50,
        },
        vitals: {
          heartRate: 75,
          bloodPressureSystolic: 120,
          bloodPressureDiastolic: 80,
          spo2: 98.5,
          bodyTemperature: 36.8,
        },
        sleep: {
          sessions: Array.from({ length: 7 }, (_, i) => ({
            start: Date.now() - i * 24 * 60 * 60 * 1000,
            end: Date.now() - i * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000,
            duration: 8,
            stages: { deep: 2, light: 4, rem: 1.5, awake: 0.5 },
          })),
        },
        body: {
          weight: 75.5,
          bodyFatPercentage: 18.2,
          leanBodyMass: 61.7,
        },
        wellness: {
          mindfulnessMinutes: 45,
          nutritionCalories: 2200,
          hydrationMl: 2500,
        },
      };

      act(() => {
        window.dispatchEvent(new CustomEvent('hc-update', { detail: largePayload }));
      });

      await waitFor(() => {
        expect(result.current.lastUpdate).toEqual(largePayload);
      });

      // Verify it was saved to localStorage
      await waitFor(() => {
        const stored = localStorage.getItem('health_connect_last_update');
        expect(stored).not.toBeNull();
        expect(JSON.parse(stored!)).toEqual(largePayload);
      });
    });
  });
});
