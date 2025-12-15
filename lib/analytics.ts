export interface AnalyticsEvent {
  type: 'conversion' | 'save' | 'clear' | 'delete' | 'copy' | 'export_excel' | 'export_csv' | 'clear_history';
  timestamp: Date;
  data?: {
    from?: string;
    to?: string;
    value?: string;
    entryId?: number;
  };
}

export interface UserSession {
  sessionId: string;
  firstVisit: Date;
  lastVisit: Date;
  country?: string;
  city?: string;
  browser?: string;
  os?: string;
  device?: string;
  screenResolution?: string;
}

export interface AnalyticsData {
  sessions: UserSession[];
  events: AnalyticsEvent[];
  buttonClicks: {
    [key: string]: number;
  };
  conversionStats: {
    total: number;
    byType: {
      binary: number;
      decimal: number;
      hexadecimal: number;
    };
  };
}

class Analytics {
  private storageKey = 'conversor_analytics';

  private detectBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private detectOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private detectDevice(): string {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'Mobile';
    if (/tablet/i.test(ua)) return 'Tablet';
    return 'Desktop';
  }

  async getLocationInfo(): Promise<{ country?: string; city?: string }> {
    try {
      // Using ipapi.co for geolocation (free tier)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        country: data.country_name,
        city: data.city,
      };
    } catch (error) {
      console.error('Error fetching location:', error);
      return {};
    }
  }

  initSession(sessionId: string): void {
    const data = this.getData();
    const existingSession = data.sessions.find(s => s.sessionId === sessionId);

    if (!existingSession) {
      this.getLocationInfo().then(location => {
        const newSession: UserSession = {
          sessionId,
          firstVisit: new Date(),
          lastVisit: new Date(),
          browser: this.detectBrowser(),
          os: this.detectOS(),
          device: this.detectDevice(),
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          ...location,
        };

        data.sessions.push(newSession);
        this.saveData(data);
      });
    } else {
      existingSession.lastVisit = new Date();
      this.saveData(data);
    }
  }

  trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): void {
    const data = this.getData();

    data.events.push({
      ...event,
      timestamp: new Date(),
    });

    // Update button clicks
    if (!data.buttonClicks[event.type]) {
      data.buttonClicks[event.type] = 0;
    }
    data.buttonClicks[event.type]++;

    // Update conversion stats
    if (event.type === 'conversion' && event.data?.from) {
      data.conversionStats.total++;
      const from = event.data.from as keyof typeof data.conversionStats.byType;
      if (data.conversionStats.byType[from] !== undefined) {
        data.conversionStats.byType[from]++;
      }
    }

    this.saveData(data);
  }

  getData(): AnalyticsData {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        // Convert date strings back to Date objects
        data.sessions = data.sessions.map((s: UserSession) => ({
          ...s,
          firstVisit: new Date(s.firstVisit),
          lastVisit: new Date(s.lastVisit),
        }));
        data.events = data.events.map((e: AnalyticsEvent) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
        return data;
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }

    return {
      sessions: [],
      events: [],
      buttonClicks: {},
      conversionStats: {
        total: 0,
        byType: {
          binary: 0,
          decimal: 0,
          hexadecimal: 0,
        },
      },
    };
  }

  private saveData(data: AnalyticsData): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }

  clearData(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const analytics = new Analytics();
