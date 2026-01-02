import { Heart, Activity, Moon, Flame, Droplets, Scale, Thermometer, Wind, Watch } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { HealthKitDataResult } from "../plugins/healthKitHeartRate";

interface HealthKitCompactPanelProps {
  isLightTheme?: boolean;
  data: HealthKitDataResult | null;
}

interface MetricItem {
  icon: any;
  label: string;
  value: number | string | undefined;
  unit?: string;
  color: string;
}

interface MetricGroup {
  title: string;
  metrics: MetricItem[];
}

export function HealthKitCompactPanel({ isLightTheme = false, data }: HealthKitCompactPanelProps) {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const groups: MetricGroup[] = [
    {
      title: t('health.activity'),
      metrics: [
        {
          icon: Activity,
          label: "Steps",
          value: data.activity?.steps,
          unit: t('health.steps_unit'),
          color: "text-blue-500"
        },
        {
          icon: Flame,
          label: "Active Calories",
          value: data.activity?.activeCaloriesBurned,
          unit: "kcal",
          color: "text-orange-500"
        },
        {
          icon: Activity,
          label: "VO₂ Max",
          value: data.activity?.vo2Max,
          unit: "ml/kg/min",
          color: "text-green-500"
        }
      ]
    },
    {
      title: t('health.vitals'),
      metrics: [
        {
          icon: Heart,
          label: "Heart Rate",
          value: data.vitals?.heartRate,
          unit: "bpm",
          color: "text-red-500"
        },
        {
          icon: Heart,
          label: "Resting HR",
          value: data.vitals?.restingHeartRate,
          unit: "bpm",
          color: "text-pink-500"
        },
        {
          icon: Activity,
          label: "HRV",
          value: data.vitals?.hrv,
          unit: "ms",
          color: "text-blue-500"
        },
        {
          icon: Heart,
          label: "Blood Pressure",
          value: data.vitals?.bloodPressureSys && data.vitals?.bloodPressureDia
            ? `${data.vitals.bloodPressureSys}/${data.vitals.bloodPressureDia}`
            : undefined,
          unit: "mmHg",
          color: "text-purple-500"
        },
        {
          icon: Droplets,
          label: "Blood Glucose",
          value: data.vitals?.bloodGlucose,
          unit: "mmol/L",
          color: "text-yellow-500"
        },
        {
          icon: Droplets,
          label: "SpO₂",
          value: data.vitals?.spo2,
          unit: "%",
          color: "text-cyan-500"
        },
        {
          icon: Wind,
          label: "Respiratory Rate",
          value: data.vitals?.respiratoryRate,
          unit: "/min",
          color: "text-teal-500"
        },
        {
          icon: Thermometer,
          label: "Body Temperature",
          value: data.vitals?.bodyTemperature,
          unit: "°C",
          color: "text-red-400"
        }
      ]
    },
    {
      title: t('health.sleep'),
      metrics: [
        {
          icon: Moon,
          label: "Duration",
          value: data.sleep?.main?.durationMin
            ? `${Math.floor(data.sleep.main.durationMin / 60)}:${String(data.sleep.main.durationMin % 60).padStart(2, '0')}`
            : undefined,
          unit: "h",
          color: "text-indigo-500"
        },
        {
          icon: Moon,
          label: "Sleep Period",
          value: data.sleep?.main?.sleepStart && data.sleep?.main?.wakeTime
            ? `${data.sleep.main.sleepStart} - ${data.sleep.main.wakeTime}`
            : undefined,
          unit: "",
          color: "text-blue-400"
        }
      ]
    },
    {
      title: "Wellness",
      metrics: [
        {
          icon: Activity,
          label: "Mindfulness",
          value: data.wellness?.mindfulnessMinutes && data.wellness?.mindfulnessSessions
            ? `${data.wellness.mindfulnessMinutes} ${t('health.min_short')} (${data.wellness.mindfulnessSessions} ${t('health.sessions')})`
            : undefined,
          unit: "",
          color: "text-purple-400"
        }
      ]
    },
    {
      title: t('health.body_measurements'),
      metrics: [
        {
          icon: Scale,
          label: "Weight",
          value: data.body?.weightKg,
          unit: "kg",
          color: "text-blue-500"
        },
        {
          icon: Activity,
          label: "Height",
          value: data.body?.heightCm,
          unit: "cm",
          color: "text-green-500"
        },
        {
          icon: Droplets,
          label: "Body Fat",
          value: data.body?.bodyFatPct,
          unit: "%",
          color: "text-orange-500"
        }
      ]
    }
  ];

  const filteredGroups = groups
    .map(group => ({
      ...group,
      metrics: group.metrics.filter(m => m.value !== undefined && m.value !== null)
    }))
    .filter(group => group.metrics.length > 0);

  if (filteredGroups.length === 0) {
    return null;
  }

  return (
    <div className={`mt-4 p-4 rounded-xl ${
      isLightTheme ? 'bg-gray-100' : 'bg-white/5'
    }`}>
      <div className="space-y-4">
        {filteredGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h4 className={`text-xs font-semibold mb-2 ${
              isLightTheme ? 'text-gray-600' : 'text-white/60'
            }`}>
              {group.title}
            </h4>
            <div className="space-y-2">
              {group.metrics.map((metric, metricIdx) => (
                <div
                  key={metricIdx}
                  className={`flex items-center justify-between p-2.5 rounded-lg ${
                    isLightTheme ? 'bg-white' : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <metric.icon className={`w-4 h-4 flex-shrink-0 ${metric.color}`} />
                    <span className={`text-sm ${
                      isLightTheme ? 'text-gray-700' : 'text-white/80'
                    }`}>
                      {metric.label}
                    </span>
                  </div>
                  <div className="text-sm font-semibold whitespace-nowrap ml-2">
                    {metric.value} {metric.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
        <p className={`text-xs ${
          isLightTheme ? 'text-gray-500' : 'text-white/50'
        }`}>
          Last update: {data.ts ? new Date(data.ts).toLocaleString() : 'N/A'}
        </p>
        
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
          isLightTheme
            ? 'bg-pink-100 text-pink-700'
            : 'bg-pink-500/20 text-pink-400'
        }`}>
          <Watch className="w-3 h-3" />
          iOS
        </div>
      </div>
    </div>
  );
}
