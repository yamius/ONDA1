import Foundation
import Capacitor
import WatchConnectivity

// MARK: - Part 1 Practices Data (Russian)
struct PracticeData {
    let id: String
    let name: String
    let duration: String
    let targetTime: Int // seconds
    let guidingTexts: [String]
}

let part1Practices: [PracticeData] = [
    PracticeData(
        id: "p1-1",
        name: "Микро-дыхание",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Почувствуй дыхание как жизнь.\nВдох — внимание в центр тела.\nВыдох — мягкое сияние изнутри.",
            "Позволь телу найти свой ритм.\nНе контролируй дыхание — наблюдай его.",
            "Каждый вдох соединяет тебя с Землёй.\nКаждый выдох возвращает тебя к покою.",
            "Просто будь в дыхании.\nОно дышит в тебе, и ты дышишь в нём."
        ]
    ),
    PracticeData(
        id: "p1-2",
        name: "Чувство бытия",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Сядь удобно. Позволь дыханию стать естественным.",
            "Ничего не ищи. Не исправляй.\nПросто наблюдай — вдох, выдох, пауза.",
            "Почувствуй, что жизнь происходит сама.",
            "В каждом вдохе — рождение,\nв каждом выдохе — возвращение.",
            "Почувствуй простое присутствие.\nНичего не нужно достигать — ты уже есть.",
            "Всё, что существует сейчас — дыхание, тело, покой."
        ]
    ),
    PracticeData(
        id: "p1-3",
        name: "Тёплый пульс",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Положи руку на живот или сердце.",
            "Почувствуй биение под ладонью.\nЭто пульс жизни — древний, надёжный.",
            "Вдох — тепло собирается внутри.\nВыдох — оно мягко распространяется.",
            "Позволь сердцу дышать вместе с Землёй.",
            "Каждое биение — это \"я живу\".\nКаждый выдох — это \"я чувствую\".",
            "Позволь телу вспомнить, как быть живым."
        ]
    ),
    PracticeData(
        id: "p1-4",
        name: "Неподвижная волна",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Всё живое колышется —\nдаже в неподвижности есть волна.",
            "Вдох — тело мягко расширяется.\nВыдох — мир становится тише.",
            "Позволь всему замедлиться.\nНикакой спешки, никакой цели.",
            "Дыхание почти незаметно,\nно продолжает связывать тебя с жизнью.",
            "В этой неподвижности есть сила.\nВ этой тишине — движение мира."
        ]
    ),
    PracticeData(
        id: "p1-5",
        name: "Внутреннее слушание",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Закрой глаза.\nПозволь тишине войти внутрь.",
            "Слушай не звуки, а пространство между ними.\nТам живёт дыхание, биение, шёпот жизни.",
            "Слушай микро-движения —\nтепло, пульсацию, поток энергии.",
            "Не пытайся понять. Просто слушай.\nТело знает, как звучит покой.",
            "Позволь вниманию раствориться\nв этой внутренней музыке."
        ]
    ),
    PracticeData(
        id: "p1-6",
        name: "Первый свет",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Вдох — свет собирается в центре груди.\nОн маленький — как искра, как точка тепла.",
            "Выдох — искра мягко распространяется.\nПозволь дыханию стать светом.",
            "Вдох — собери свет.\nВыдох — раздели его.",
            "Тело наполняется сиянием изнутри.\nСвет вспоминается из глубины.",
            "С каждым дыханием пространство\nстановится более прозрачным.",
            "Свет дышит тобой."
        ]
    ),
    PracticeData(
        id: "p1-7",
        name: "Жидкое присутствие",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Почувствуй тело не твёрдое, а жидкое.\nКаждая клетка наполнена тёплой водой.",
            "Вдох — вода поднимается,\nнаполняет грудь, плечи, руки.",
            "Выдох — поток мягко спускается\nк животу, к ногам.",
            "Дыхание становится приливом и отливом.\nВсё движется плавно, без усилий.",
            "Позволь телу раствориться\nв собственном дыхании."
        ]
    ),
    PracticeData(
        id: "p1-8",
        name: "Счёт дыхания",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Сядь спокойно.\nПозволь дыханию идти естественно.",
            "Считай дыхания —\nвдох раз, выдох раз.\nВдох два, выдох два.",
            "Считай мягко, без напряжения.\nПозволь цифрам быть дыханием.",
            "Если внимание уходит —\nвернись к следующему вдоху.",
            "С каждым счётом\nум становится более прозрачным.",
            "Цифры растворяются, ритм остаётся."
        ]
    ),
    PracticeData(
        id: "p1-9",
        name: "Точка покоя",
        duration: "6 мин",
        targetTime: 360,
        guidingTexts: [
            "Закрой глаза.\nСделай несколько мягких вдохов.",
            "С каждым выдохом\nтело становится тише.",
            "Где-то глубоко внутри есть точка,\nгде ничего не происходит.",
            "Не ищи её.\nПозволь ей проявиться самой.",
            "Вдох — внимание собирается в центре.\nВыдох — растворяет всё лишнее.",
            "Почувствуй центр восприятия —\nнеподвижную ось в глубине тела."
        ]
    ),
    PracticeData(
        id: "p1-10",
        name: "Я есть тишина",
        duration: "6 мин",
        targetTime: 360,
        guidingTexts: [
            "Сядь удобно.\nДыхание становится незаметным.",
            "Не нужно дышать глубже.\nВсё уже происходит само.",
            "Позволь телу быть неподвижным.",
            "Не слушай дыхание — будь им.\nНе наблюдай тишину — стань ею.",
            "Всё лишнее растворяется.\nОстаётся только осознанность.",
            "Больше нет \"я\" и \"тишины\" —\nесть только дыхание, знающее себя."
        ]
    ),
    PracticeData(
        id: "p1-11",
        name: "Поток земли",
        duration: "12 мин",
        targetTime: 720,
        guidingTexts: [
            "Стой устойчиво.\nПочувствуй свои ноги.",
            "Вдох — подними внимание к груди.\nВыдох — направь всё вниз, в землю.",
            "От стоп растут корни света.\nС каждым выдохом — глубже.",
            "Вдох — собери силу в груди.\nВыдох — отпусти напряжение вниз.",
            "Почувствуй вес как опору.\nЗемля держит тебя.",
            "Вдох — луч от сердца к небу.\nВыдох — река к ядру планеты."
        ]
    ),
    PracticeData(
        id: "p1-12",
        name: "Корень тела",
        duration: "12 мин",
        targetTime: 720,
        guidingTexts: [
            "Почувствуй вес тела.\nОснование позвоночника — начало.",
            "От копчика вниз прорастают корни.\nС каждым выдохом — глубже в землю.",
            "Корни находят воду, камень, тепло.\nТы связан с Землёй.",
            "Вдох — энергия поднимается по стволу.\nВыдох — корни закрепляются.",
            "Ты — дерево.\nТвои ноги — ствол.\nТвои руки — ветви.",
            "Земля питает тебя.\nНебо вдохновляет тебя."
        ]
    )
]

@objc(OndaWatchPlugin)
public class OndaWatchPlugin: CAPPlugin {

    private let implementation = OndaWatchManager.shared

    public override func load() {
        super.load()
        print("[ONDA Plugin] Loading OndaWatchPlugin")
        implementation.plugin = self
        // Session уже активирована в AppDelegate, но на всякий случай
        implementation.activateSession()
    }

    @objc func getStatus(_ call: CAPPluginCall) {
        let status = implementation.status()
        print("[ONDA Plugin] getStatus: \(status)")
        call.resolve(status)
    }

    @objc func startRealtime(_ call: CAPPluginCall) {
        print("[ONDA Plugin] startRealtime called")
        implementation.sendCommand(type: "start")
        call.resolve()
    }

    @objc func stopRealtime(_ call: CAPPluginCall) {
        print("[ONDA Plugin] stopRealtime called")
        implementation.sendCommand(type: "stop")
        call.resolve()
    }
    
    @objc func sendHeartbeat(_ call: CAPPluginCall) {
        implementation.sendHeartbeat()
        call.resolve()
    }
    
    @objc func sendPracticesToWatch(_ call: CAPPluginCall) {
        let partNumber = call.getInt("partNumber") ?? 1
        print("[ONDA Plugin] sendPracticesToWatch part: \(partNumber)")
        implementation.sendPractices(forPart: partNumber)
        call.resolve()
    }
}

// MARK: - Менеджер WCSession (iOS ↔ watchOS)

class OndaWatchManager: NSObject, WCSessionDelegate {

    static let shared = OndaWatchManager()

    // НЕ weak - чтобы plugin не терялся пока приложение активно
    var plugin: OndaWatchPlugin?
    
    // Debug log для отображения в UI
    var debugLog: [String] = []
    var receivedCount: Int = 0

    private var session: WCSession? {
        WCSession.isSupported() ? WCSession.default : nil
    }
    
    private func addDebugLog(_ message: String) {
        let timestamp = DateFormatter.localizedString(from: Date(), dateStyle: .none, timeStyle: .medium)
        let entry = "\(timestamp): \(message)"
        print("[ONDA Debug] \(entry)")
        debugLog.append(entry)
        // Keep only last 20 entries
        if debugLog.count > 20 {
            debugLog.removeFirst()
        }
        // Notify JS about debug update
        DispatchQueue.main.async {
            self.plugin?.notifyListeners("debugLog", data: [
                "log": self.debugLog,
                "receivedCount": self.receivedCount
            ])
        }
    }

    func activateSession() {
        guard let session = session else {
            addDebugLog("WCSession not supported")
            return
        }
        if session.delegate == nil {
            session.delegate = self
            session.activate()
            addDebugLog("WCSession activating...")
        } else {
            addDebugLog("WCSession has delegate")
        }
    }

    func status() -> [String: Any] {
        guard let session = session else {
            return ["supported": false]
        }

        return [
            "supported": WCSession.isSupported(),
            "paired": session.isPaired,
            "watchAppInstalled": session.isWatchAppInstalled,
            "reachable": session.isReachable
        ]
    }

    func sendCommand(type: String) {
        guard let session = session else {
            print("[ONDA Manager] No session for command")
            return
        }
        
        print("[ONDA Manager] Sending command '\(type)', reachable: \(session.isReachable)")
        
        let message: [String: Any] = ["type": type, "ts": Date().timeIntervalSince1970]

        if session.isReachable {
            // Прямая отправка когда часы активны
            session.sendMessage(message, replyHandler: { reply in
                print("[ONDA Manager] Command sent OK")
            }) { error in
                print("[ONDA Manager] sendCommand error: \(error.localizedDescription)")
            }
        } else {
            // Когда часы не активны - используем оба метода для надёжности
            
            // 1. transferUserInfo - разбудит приложение на часах в фоне
            session.transferUserInfo(message)
            print("[ONDA Manager] Command transferred via userInfo")
            
            // 2. updateApplicationContext - данные будут доступны сразу при пробуждении
            do {
                try session.updateApplicationContext(["command": type, "ts": Date().timeIntervalSince1970])
                print("[ONDA Manager] Application context updated")
            } catch {
                print("[ONDA Manager] updateApplicationContext error: \(error.localizedDescription)")
            }
        }
    }
    
    func sendHeartbeat() {
        guard let session = session else {
            return
        }
        
        let message: [String: Any] = [
            "type": "heartbeat",
            "ts": Date().timeIntervalSince1970
        ]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: nil) { error in
                print("[ONDA Manager] heartbeat error: \(error.localizedDescription)")
            }
        } else {
            // Send via transferUserInfo when not immediately reachable
            // This queues the message and delivers when watch becomes reachable
            session.transferUserInfo(message)
        }
    }
    
    func sendPractices(forPart partNumber: Int) {
        guard let session = session else {
            print("[ONDA Manager] No session for practices")
            return
        }
        
        // Only Part 1 for now
        let practices: [[String: Any]] = part1Practices.map { practice in
            return [
                "id": practice.id,
                "name": practice.name,
                "duration": practice.duration,
                "targetTime": practice.targetTime,
                "guidingTexts": practice.guidingTexts
            ]
        }
        
        let message: [String: Any] = [
            "type": "practices",
            "partNumber": partNumber,
            "practices": practices,
            "ts": Date().timeIntervalSince1970
        ]
        
        print("[ONDA Manager] Sending \(practices.count) practices for part \(partNumber)")
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: { reply in
                print("[ONDA Manager] Practices sent OK")
            }) { error in
                print("[ONDA Manager] sendPractices error: \(error.localizedDescription)")
                // Fallback to transferUserInfo
                session.transferUserInfo(message)
            }
        } else {
            session.transferUserInfo(message)
            print("[ONDA Manager] Practices transferred via userInfo")
        }
    }
    
    func sendPracticeData(practiceId: String) {
        guard let session = session else { return }
        
        guard let practice = part1Practices.first(where: { $0.id == practiceId }) else {
            print("[ONDA Manager] Practice not found: \(practiceId)")
            return
        }
        
        let message: [String: Any] = [
            "type": "practiceData",
            "id": practice.id,
            "name": practice.name,
            "targetTime": practice.targetTime,
            "guidingTexts": practice.guidingTexts,
            "ts": Date().timeIntervalSince1970
        ]
        
        print("[ONDA Manager] Sending practice data: \(practiceId)")
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: nil) { error in
                print("[ONDA Manager] sendPracticeData error: \(error)")
            }
        } else {
            session.transferUserInfo(message)
        }
    }

    // MARK: - WCSessionDelegate

    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        if let error = error {
            addDebugLog("Activation error: \(error.localizedDescription)")
        } else {
            addDebugLog("Activated: p=\(session.isPaired) w=\(session.isWatchAppInstalled) r=\(session.isReachable)")
        }
    }

    func sessionDidBecomeInactive(_ session: WCSession) {
        print("[ONDA Manager] Session became inactive")
    }

    func sessionDidDeactivate(_ session: WCSession) {
        print("[ONDA Manager] Session deactivated, reactivating...")
        session.activate()
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        addDebugLog("Reachable: \(session.isReachable)")
    }

    // Получаем данные с часов через sendMessage
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {
        addDebugLog("Msg: \(message.keys.joined(separator: ","))")
        handleReceivedData(message)
    }
    
    // Получаем данные с часов через sendMessage с reply
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any],
                 replyHandler: @escaping ([String : Any]) -> Void) {
        addDebugLog("MsgReply: \(message.keys.joined(separator: ","))")
        handleReceivedData(message)
        replyHandler(["received": true])
    }
    
    // Получаем данные с часов через transferUserInfo
    func session(_ session: WCSession,
                 didReceiveUserInfo userInfo: [String : Any] = [:]) {
        addDebugLog("UserInfo: \(userInfo.keys.joined(separator: ","))")
        handleReceivedData(userInfo)
    }
    
    // Общий обработчик данных с часов
    private func handleReceivedData(_ data: [String: Any]) {
        guard let type = data["type"] as? String else {
            addDebugLog("No type in data")
            return
        }

        switch type {
        case "heartRate":
            if let value = data["value"] as? Double {
                receivedCount += 1
                addDebugLog("HR#\(receivedCount): \(Int(value)) bpm, plugin=\(plugin != nil)")
                DispatchQueue.main.async {
                    if let p = self.plugin {
                        p.notifyListeners("heartRate", data: ["value": value])
                    } else {
                        self.addDebugLog("ERROR: plugin nil!")
                    }
                }
            }

        case "status":
            if let value = data["value"] as? String {
                addDebugLog("Status: \(value)")
                DispatchQueue.main.async {
                    if let p = self.plugin {
                        p.notifyListeners("status", data: ["value": value])
                    }
                }
            }
            
        case "requestPractices":
            // Watch requests practices list for a specific part
            if let partNumber = data["partNumber"] as? Int {
                addDebugLog("Watch requests practices for part \(partNumber)")
                sendPractices(forPart: partNumber)
            }
            
        case "startPractice":
            // Watch started a practice - notify JS
            if let practiceId = data["practiceId"] as? String {
                addDebugLog("Watch started practice: \(practiceId)")
                DispatchQueue.main.async {
                    self.plugin?.notifyListeners("practiceStarted", data: ["practiceId": practiceId])
                }
            }
            
        case "endPractice":
            // Watch ended a practice - notify JS
            if let practiceId = data["practiceId"] as? String,
               let duration = data["duration"] as? Int {
                addDebugLog("Watch ended practice: \(practiceId), duration: \(duration)s")
                DispatchQueue.main.async {
                    self.plugin?.notifyListeners("practiceEnded", data: [
                        "practiceId": practiceId,
                        "duration": duration
                    ])
                }
            }

        default:
            addDebugLog("Unknown: \(type)")
        }
    }
}
