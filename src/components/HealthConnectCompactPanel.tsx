import { Heart, Activity, Moon, Flame, Droplets, Scale, Thermometer, Wind, Apple, Utensils, Smartphone, Bug } from "lucide-react";
import type { HcUpdatePayload } from "../bridge/healthConnectBridge";

interface HealthConnectCompactPanelProps {
  isLightTheme?: boolean;
  data: HcUpdatePayload | null;
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

export function HealthConnectCompactPanel({ isLightTheme = false, data }: HealthConnectCompactPanelProps) {

  if (!data) {
    return null;
  }

  const groups: MetricGroup[] = [
    {
      title: "Активность",
      metrics: [
        {
          icon: Activity,
          label: "Steps",
          value: data.activity?.steps,
          unit: "шагов",
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
      title: "Витальные показатели",
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
          unit: "",
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
        },
        {
          icon: Thermometer,
          label: "Skin Temperature",
          value: data.vitals?.skinTemperature,
          unit: "°C",
          color: "text-orange-400"
        }
      ]
    },
    {
      title: "Сон",
      metrics: [
        {
          icon: Moon,
          label: "Duration",
          value: data.sleep?.sessions?.[0]?.durationMin
            ? `${Math.floor(data.sleep.sessions[0].durationMin / 60)}:${String(data.sleep.sessions[0].durationMin % 60).padStart(2, '0')}`
            : undefined,
          unit: "h",
          color: "text-indigo-500"
        },
        {
          icon: Moon,
          label: "Sleep Period",
          value: data.sleep?.sessions?.[0]?.startTime && data.sleep?.sessions?.[0]?.endTime
            ? `${new Date(data.sleep.sessions[0].startTime).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})} - ${new Date(data.sleep.sessions[0].endTime).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`
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
            ? `${data.wellness.mindfulnessMinutes} мин (${data.wellness.mindfulnessSessions} сессий)`
            : undefined,
          unit: "",
          color: "text-purple-400"
        },
        {
          icon: Heart,
          label: "Sexual Activity",
          value: data.wellness?.sexualActivityEvents,
          unit: "событий",
          color: "text-pink-400"
        }
      ]
    },
    {
      title: "Измерения тела",
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
        },
        {
          icon: Droplets,
          label: "Body Water",
          value: data.body?.bodyWaterMassKg,
          unit: "kg",
          color: "text-cyan-500"
        },
        {
          icon: Activity,
          label: "Bone Mass",
          value: data.body?.boneMassKg,
          unit: "kg",
          color: "text-gray-500"
        },
        {
          icon: Activity,
          label: "Lean Body Mass",
          value: data.body?.leanBodyMassKg,
          unit: "kg",
          color: "text-purple-500"
        },
        {
          icon: Flame,
          label: "BMR",
          value: data.body?.basalMetabolicRate,
          unit: "kcal",
          color: "text-red-500"
        }
      ]
    },
    {
      title: "Питание",
      metrics: [
        {
          icon: Apple,
          label: "Calories",
          value: data.nutrition?.calories,
          unit: "kcal",
          color: "text-red-500"
        },
        {
          icon: Utensils,
          label: "Protein",
          value: data.nutrition?.proteinGrams,
          unit: "g",
          color: "text-pink-500"
        },
        {
          icon: Utensils,
          label: "Fat",
          value: data.nutrition?.fatGrams,
          unit: "g",
          color: "text-yellow-500"
        },
        {
          icon: Utensils,
          label: "Carbs",
          value: data.nutrition?.carbsGrams,
          unit: "g",
          color: "text-orange-500"
        },
        {
          icon: Droplets,
          label: "Hydration",
          value: data.nutrition?.hydrationLiters,
          unit: "L",
          color: "text-blue-500"
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
          data.source === 'health_connect'
            ? isLightTheme
              ? 'bg-green-100 text-green-700'
              : 'bg-green-500/20 text-green-400'
            : isLightTheme
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {data.source === 'health_connect' ? (
            <>
              <Smartphone className="w-3 h-3" />
              Android
            </>
          ) : (
            <>
              <Bug className="w-3 h-3" />
              Debug
            </>
          )}
        </div>
      </div>
    </div>
  );
}
