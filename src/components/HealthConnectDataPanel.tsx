import { useEffect, useState } from "react";
import { Heart, Activity, Moon, Brain, Scale, Flame, Droplets, AlertCircle } from "lucide-react";
import type { HcUpdatePayload } from "../bridge/healthConnectBridge";

export function HealthConnectDataPanel() {
  const [last, setLast] = useState<HcUpdatePayload | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as HcUpdatePayload;
      console.log('[HealthConnectDataPanel] Received hc-update event:', detail);
      setLast(detail);
    };
    window.addEventListener("hc-update", handler as EventListener);
    console.log('[HealthConnectDataPanel] Listening for hc-update events');
    return () => window.removeEventListener("hc-update", handler as EventListener);
  }, []);

  if (!last) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Google Health Connect
        </h2>
        <p className="text-white/60 text-sm">
          Данных пока нет. Подключите Google Health Connect на телефоне.
        </p>
      </div>
    );
  }

  const { activity, vitals, sleep, wellness, body, nutrition, femaleHealth } = last;

  return (
    <div className="space-y-4">
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-cyan-500/30">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Google Health Connect
        </h2>
        <p className="text-white/50 text-xs mb-4">
          Последнее обновление: {last.ts ? new Date(last.ts).toLocaleString('ru-RU') : '—'}
        </p>

        {activity && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-cyan-300">Активность</h3>
            <div className="grid grid-cols-2 gap-3">
              {activity.steps !== undefined && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30">
                  <Activity className="w-5 h-5 text-blue-400 mb-1" />
                  <div className="text-xl font-bold">{activity.steps}</div>
                  <div className="text-xs text-gray-400">Шаги</div>
                </div>
              )}
              {activity.activeCaloriesBurned !== undefined && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-orange-500/30">
                  <Flame className="w-5 h-5 text-orange-400 mb-1" />
                  <div className="text-xl font-bold">{activity.activeCaloriesBurned}</div>
                  <div className="text-xs text-gray-400">Active Calories (kcal)</div>
                </div>
              )}
              {activity.vo2Max !== undefined && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
                  <Activity className="w-5 h-5 text-green-400 mb-1" />
                  <div className="text-xl font-bold">{activity.vo2Max}</div>
                  <div className="text-xs text-gray-400">VO₂ Max (ml/kg/min)</div>
                </div>
              )}
            </div>
          </div>
        )}

        {vitals && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-red-300">Витальные показатели</h3>
            <div className="space-y-2 text-sm">
              {vitals.heartRate !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Heart Rate:</span>
                  <span className="font-semibold">{vitals.heartRate} bpm</span>
                </div>
              )}
              {vitals.restingHeartRate !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Resting HR:</span>
                  <span className="font-semibold">{vitals.restingHeartRate} bpm</span>
                </div>
              )}
              {vitals.hrv !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">HRV:</span>
                  <span className="font-semibold">{vitals.hrv} ms</span>
                </div>
              )}
              {(vitals.bloodPressureSys !== undefined && vitals.bloodPressureDia !== undefined) && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Blood Pressure:</span>
                  <span className="font-semibold">{vitals.bloodPressureSys}/{vitals.bloodPressureDia} mmHg</span>
                </div>
              )}
              {vitals.bloodGlucose !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Blood Glucose:</span>
                  <span className="font-semibold">{vitals.bloodGlucose}</span>
                </div>
              )}
              {vitals.spo2 !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">SpO₂:</span>
                  <span className="font-semibold">{vitals.spo2}%</span>
                </div>
              )}
              {vitals.respiratoryRate !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Respiratory Rate:</span>
                  <span className="font-semibold">{vitals.respiratoryRate} /min</span>
                </div>
              )}
              {vitals.bodyTemperature !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Body Temperature:</span>
                  <span className="font-semibold">{vitals.bodyTemperature}°C</span>
                </div>
              )}
              {vitals.skinTemperature !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Skin Temperature:</span>
                  <span className="font-semibold">{vitals.skinTemperature}°C</span>
                </div>
              )}
            </div>
          </div>
        )}

        {sleep && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-indigo-300">
              <Moon className="w-5 h-5" />
              Сон
            </h3>
            <div className="space-y-2 text-sm">
              {sleep.main && (
                <div className="bg-black/20 rounded p-3">
                  <div className="font-semibold mb-1">
                    {sleep.main.date} {sleep.main.sleepStart}–{sleep.main.wakeTime}
                  </div>
                  <div className="text-gray-400">
                    Длительность: {sleep.main.durationMin} мин ({(sleep.main.durationMin / 60).toFixed(1)} ч)
                  </div>
                </div>
              )}
              {sleep.sessions && sleep.sessions.length > 0 && (
                <>
                  {sleep.sessions.map((session, idx) => (
                    <div key={idx} className="bg-black/20 rounded p-3">
                      <div className="font-semibold mb-1">
                        {new Date(session.startTime).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})} – 
                        {new Date(session.endTime).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}
                      </div>
                      {session.durationMin && (
                        <div className="text-gray-400">
                          Длительность: {session.durationMin} мин ({(session.durationMin / 60).toFixed(1)} ч)
                        </div>
                      )}
                      {session.stages && session.stages.length > 0 && (
                        <div className="text-gray-400 text-xs mt-1">
                          Стадий: {session.stages.length}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {wellness && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-300">
              <Brain className="w-5 h-5" />
              Wellness
            </h3>
            <div className="space-y-2 text-sm">
              {wellness.mindfulnessMinutes !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Mindfulness:</span>
                  <span className="font-semibold">
                    {wellness.mindfulnessMinutes} мин ({wellness.mindfulnessSessions || 0} сессий)
                  </span>
                </div>
              )}
              {wellness.sexualActivityEvents !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Sexual Activity:</span>
                  <span className="font-semibold">{wellness.sexualActivityEvents} событий</span>
                </div>
              )}
            </div>
          </div>
        )}

        {body && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-blue-300">
              <Scale className="w-5 h-5" />
              Измерения тела
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {body.weightKg !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Weight:</span>
                  <span className="font-semibold">{body.weightKg} kg</span>
                </div>
              )}
              {body.heightCm !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Height:</span>
                  <span className="font-semibold">{body.heightCm} cm</span>
                </div>
              )}
              {body.bodyFatPct !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Body Fat:</span>
                  <span className="font-semibold">{body.bodyFatPct}%</span>
                </div>
              )}
              {body.bodyWaterMassKg !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Body Water:</span>
                  <span className="font-semibold">{body.bodyWaterMassKg} kg</span>
                </div>
              )}
              {body.boneMassKg !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Bone Mass:</span>
                  <span className="font-semibold">{body.boneMassKg} kg</span>
                </div>
              )}
              {body.leanBodyMassKg !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Lean Body Mass:</span>
                  <span className="font-semibold">{body.leanBodyMassKg} kg</span>
                </div>
              )}
              {body.basalMetabolicRate !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2 col-span-2">
                  <span className="text-gray-300">BMR:</span>
                  <span className="font-semibold">{body.basalMetabolicRate} kcal/day</span>
                </div>
              )}
            </div>
          </div>
        )}

        {nutrition && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-green-300">
              <Flame className="w-5 h-5" />
              Питание
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {nutrition.calories !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Calories:</span>
                  <span className="font-semibold">{nutrition.calories} kcal</span>
                </div>
              )}
              {nutrition.proteinGrams !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Protein:</span>
                  <span className="font-semibold">{nutrition.proteinGrams} g</span>
                </div>
              )}
              {nutrition.fatGrams !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Fat:</span>
                  <span className="font-semibold">{nutrition.fatGrams} g</span>
                </div>
              )}
              {nutrition.carbsGrams !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Carbs:</span>
                  <span className="font-semibold">{nutrition.carbsGrams} g</span>
                </div>
              )}
              {nutrition.hydrationLiters !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2 col-span-2">
                  <span className="text-gray-300 flex items-center gap-1">
                    <Droplets className="w-4 h-4" /> Hydration:
                  </span>
                  <span className="font-semibold">{nutrition.hydrationLiters} L</span>
                </div>
              )}
            </div>
          </div>
        )}

        {femaleHealth && (
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-pink-300">
              <Heart className="w-5 h-5" />
              Женское здоровье
            </h3>
            <div className="space-y-2 text-sm">
              {femaleHealth.menstruationFlow && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Menstruation Flow:</span>
                  <span className="font-semibold capitalize">{femaleHealth.menstruationFlow}</span>
                </div>
              )}
              {femaleHealth.basalBodyTemperature !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Basal Body Temperature:</span>
                  <span className="font-semibold">{femaleHealth.basalBodyTemperature}°C</span>
                </div>
              )}
              {femaleHealth.cervicalMucus && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Cervical Mucus:</span>
                  <span className="font-semibold capitalize">{femaleHealth.cervicalMucus.replace('_', ' ')}</span>
                </div>
              )}
              {femaleHealth.ovulationTestPositive !== undefined && (
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-gray-300">Ovulation Test:</span>
                  <span className="font-semibold">{femaleHealth.ovulationTestPositive ? "Positive" : "Negative"}</span>
                </div>
              )}
              {femaleHealth.intermenstrualBleeding && (
                <div className="flex items-center gap-2 bg-black/20 rounded p-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Intermenstrual Bleeding</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
