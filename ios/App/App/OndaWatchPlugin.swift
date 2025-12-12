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

// 3 min = 180s / 15s = 12 texts, 6 min = 24 texts, 12 min = 48 texts
let part1Practices: [PracticeData] = [
    PracticeData(
        id: "p1-1",
        name: "Микро-дыхание",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Почувствуй дыхание как жизнь.\nВдох — внимание в центр тела.",
            "Выдох — мягкое сияние изнутри.",
            "Позволь телу найти свой ритм.",
            "Не контролируй дыхание — наблюдай его.",
            "Каждый вдох соединяет тебя с Землёй.",
            "Каждый выдох возвращает тебя к покою.",
            "Просто будь в дыхании.",
            "Оно дышит в тебе, и ты дышишь в нём.",
            "Вдох — тепло наполняет грудь.",
            "Выдох — растворяет напряжение.",
            "Дыхание — это присутствие.",
            "Ты здесь. Ты дышишь. Ты есть."
        ]
    ),
    PracticeData(
        id: "p1-2",
        name: "Чувство бытия",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Сядь удобно.\nПозволь дыханию стать естественным.",
            "Ничего не ищи. Не исправляй.",
            "Просто наблюдай — вдох, выдох, пауза.",
            "Почувствуй, что жизнь происходит сама.",
            "В каждом вдохе — рождение.",
            "В каждом выдохе — возвращение.",
            "Почувствуй простое присутствие.",
            "Ничего не нужно достигать — ты уже есть.",
            "Всё, что существует сейчас — дыхание.",
            "Тело. Покой. Тишина внутри.",
            "Позволь осознанности покоиться.",
            "Ты — чистое бытие."
        ]
    ),
    PracticeData(
        id: "p1-3",
        name: "Тёплый пульс",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Положи руку на живот или сердце.",
            "Почувствуй биение под ладонью.",
            "Это пульс жизни — древний, надёжный.",
            "Вдох — тепло собирается внутри.",
            "Выдох — оно мягко распространяется.",
            "Позволь сердцу дышать вместе с Землёй.",
            "Каждое биение — это \"я живу\".",
            "Каждый выдох — это \"я чувствую\".",
            "Позволь телу вспомнить, как быть живым.",
            "Пульс — это ритм Вселенной в тебе.",
            "Тепло растекается по всему телу.",
            "Ты — живой. Ты — настоящий."
        ]
    ),
    PracticeData(
        id: "p1-4",
        name: "Неподвижная волна",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Всё живое колышется.",
            "Даже в неподвижности есть волна.",
            "Вдох — тело мягко расширяется.",
            "Выдох — мир становится тише.",
            "Позволь всему замедлиться.",
            "Никакой спешки, никакой цели.",
            "Дыхание почти незаметно.",
            "Но продолжает связывать тебя с жизнью.",
            "В этой неподвижности есть сила.",
            "В этой тишине — движение мира.",
            "Волна внутри — мягкая и спокойная.",
            "Ты — покой в движении."
        ]
    ),
    PracticeData(
        id: "p1-5",
        name: "Внутреннее слушание",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Закрой глаза.",
            "Позволь тишине войти внутрь.",
            "Слушай не звуки, а пространство.",
            "Там живёт дыхание, биение, шёпот жизни.",
            "Слушай микро-движения.",
            "Тепло, пульсацию, поток энергии.",
            "Не пытайся понять. Просто слушай.",
            "Тело знает, как звучит покой.",
            "Позволь вниманию раствориться.",
            "В этой внутренней музыке.",
            "Каждый звук — это послание.",
            "Тело говорит с тобой."
        ]
    ),
    PracticeData(
        id: "p1-6",
        name: "Первый свет",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Вдох — свет собирается в центре груди.",
            "Он маленький — как искра, как точка тепла.",
            "Выдох — искра мягко распространяется.",
            "Позволь дыханию стать светом.",
            "Вдох — собери свет.",
            "Выдох — раздели его.",
            "Тело наполняется сиянием изнутри.",
            "Свет вспоминается из глубины.",
            "С каждым дыханием пространство прозрачнее.",
            "Свет дышит тобой.",
            "Ты — источник сияния.",
            "Свет не приходит извне — он внутри."
        ]
    ),
    PracticeData(
        id: "p1-7",
        name: "Жидкое присутствие",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Почувствуй тело не твёрдое, а жидкое.",
            "Каждая клетка наполнена тёплой водой.",
            "Вдох — вода поднимается.",
            "Наполняет грудь, плечи, руки.",
            "Выдох — поток мягко спускается.",
            "К животу, к ногам.",
            "Дыхание становится приливом и отливом.",
            "Всё движется плавно, без усилий.",
            "Позволь телу раствориться.",
            "В собственном дыхании.",
            "Ты — вода, принимающая любую форму.",
            "Течение — это жизнь."
        ]
    ),
    PracticeData(
        id: "p1-8",
        name: "Счёт дыхания",
        duration: "3 мин",
        targetTime: 180,
        guidingTexts: [
            "Сядь спокойно.",
            "Позволь дыханию идти естественно.",
            "Считай дыхания — вдох раз, выдох раз.",
            "Вдох два, выдох два.",
            "Считай мягко, без напряжения.",
            "Позволь цифрам быть дыханием.",
            "Если внимание уходит —",
            "Вернись к следующему вдоху.",
            "С каждым счётом ум становится прозрачнее.",
            "Цифры растворяются, ритм остаётся.",
            "Вдох — я. Выдох — есть.",
            "Просто счёт. Просто дыхание."
        ]
    ),
    PracticeData(
        id: "p1-9",
        name: "Точка покоя",
        duration: "6 мин",
        targetTime: 360,
        guidingTexts: [
            "Закрой глаза.",
            "Сделай несколько мягких вдохов.",
            "С каждым выдохом тело становится тише.",
            "Где-то глубоко внутри есть точка.",
            "Там ничего не происходит.",
            "Не ищи её. Позволь ей проявиться.",
            "Вдох — внимание собирается в центре.",
            "Выдох — растворяет всё лишнее.",
            "Почувствуй центр восприятия.",
            "Неподвижную ось в глубине тела.",
            "Время замедляется.",
            "Всё внутри мягко останавливается.",
            "Но жизнь продолжается.",
            "Без твоего участия.",
            "Это не место и не образ.",
            "Это присутствие без формы.",
            "Чем меньше стараешься — тем яснее.",
            "Позволь дыханию стать шёпотом.",
            "Опустись в корень тишины.",
            "Здесь нет \"я\" и \"мира\".",
            "Есть только покой.",
            "Из которого рождается дыхание.",
            "В этом покое — сила.",
            "В этой тишине — источник движения."
        ]
    ),
    PracticeData(
        id: "p1-10",
        name: "Я есть тишина",
        duration: "6 мин",
        targetTime: 360,
        guidingTexts: [
            "Сядь удобно.",
            "Дыхание становится незаметным.",
            "Не нужно дышать глубже.",
            "Всё уже происходит само.",
            "Позволь телу быть неподвижным.",
            "Не слушай дыхание — будь им.",
            "Не наблюдай тишину — стань ею.",
            "Всё лишнее растворяется.",
            "Остаётся только осознанность.",
            "Она без границ, без имени.",
            "Без начала и конца.",
            "Тело — просто дыхание Земли.",
            "Ум — отражение пространства.",
            "Всё, что есть — присутствие.",
            "Почувствуй мягкий свет изнутри.",
            "Он не движется — просто есть.",
            "Дыши этим светом.",
            "Будь светом, который слушает себя.",
            "Больше нет \"я\" и \"тишины\".",
            "Есть только дыхание, знающее себя.",
            "В этом дыхании — покой.",
            "В этом покое — жизнь.",
            "В этой жизни — ты.",
            "Я есть тишина. Я есть свет."
        ]
    ),
    PracticeData(
        id: "p1-11",
        name: "Поток земли",
        duration: "12 мин",
        targetTime: 720,
        guidingTexts: [
            "Стой устойчиво. Почувствуй свои ноги.",
            "Расширь контакт с землёй.",
            "Подошвы становятся шире и тяжелее.",
            "Вдох — подними внимание от стоп к груди.",
            "Почувствуй тёплое пространство в центре.",
            "Выдох — направь всё вниз, через ноги, в землю.",
            "Представь корни света от стоп.",
            "С каждым вдохом — грудь наполняется теплом.",
            "С каждым выдохом — корни идут глубже.",
            "Они находят воду и камень.",
            "Не спеши. Позволь гравитации работать.",
            "Вдох — собери силу в груди, расправь плечи.",
            "Выдох — отпусти напряжение вниз.",
            "Колени мягкие, челюсть свободна.",
            "Живот тёплый и расслабленный.",
            "Почувствуй вес как опору, а не препятствие.",
            "Земля держит тебя.",
            "Если ум уходит в мысли —",
            "Вернись к подошвам ног.",
            "Именно здесь — твоя опора и дом.",
            "Вдох — как луч от сердца к небу.",
            "Выдох — как река к ядру планеты.",
            "Ты соединяешь два мира.",
            "Небо и Земля дышат через тебя.",
            "С каждым вдохом — сила растёт.",
            "С каждым выдохом — корни крепнут.",
            "Грудь открыта к небу.",
            "Стопы укоренены в земле.",
            "Ты — проводник между мирами.",
            "Почувствуй плотность внизу.",
            "И лёгкость вверху.",
            "Это твоя естественная форма.",
            "Вдох наполняет тебя светом неба.",
            "Выдох уносит всё лишнее в землю.",
            "Земля принимает и трансформирует.",
            "Небо вдохновляет и поднимает.",
            "Ты — между ними. В равновесии.",
            "Корни уходят к центру Земли.",
            "Ветви тянутся к звёздам.",
            "Позволь телу стать каналом.",
            "Энергия течёт свободно.",
            "Сверху вниз. Снизу вверх.",
            "Вдох — приём. Выдох — отдача.",
            "В этом потоке — жизнь.",
            "В этой связи — сила.",
            "Ты укоренён. Ты свободен.",
            "Поток Земли течёт через тебя.",
            "Ты — часть великого целого."
        ]
    ),
    PracticeData(
        id: "p1-12",
        name: "Корень тела",
        duration: "12 мин",
        targetTime: 720,
        guidingTexts: [
            "Почувствуй вес тела.",
            "Основание позвоночника — начало.",
            "От копчика вниз прорастают корни.",
            "С каждым выдохом — глубже в землю.",
            "Корни находят воду, камень, тепло.",
            "Ты связан с Землёй.",
            "Вдох — энергия поднимается по стволу.",
            "Выдох — корни закрепляются глубже.",
            "Ты — дерево.",
            "Твои ноги — ствол.",
            "Твои руки — ветви.",
            "Земля питает тебя.",
            "Небо вдохновляет тебя.",
            "Почувствуй, как корни разветвляются.",
            "Они оплетают камни, обнимают землю.",
            "С каждым вдохом — сок поднимается.",
            "Питает ствол, ветви, листья.",
            "С каждым выдохом — связь крепнет.",
            "Ты не можешь упасть.",
            "Корни держат тебя.",
            "Вдох — рост вверх, к свету.",
            "Выдох — укоренение вниз, в землю.",
            "Это естественный ритм жизни.",
            "Рост и укоренение. Подъём и опора.",
            "Позволь корням расти ещё глубже.",
            "Туда, где Земля тёплая и древняя.",
            "Ты касаешься памяти планеты.",
            "Миллионы лет дышат в тебе.",
            "Вдох — свет входит через макушку.",
            "Выдох — тьма уходит через корни.",
            "Земля принимает всё лишнее.",
            "И возвращает чистую силу.",
            "Почувствуй обмен энергией.",
            "Давать и получать — одно движение.",
            "Ты — часть великого организма.",
            "Земля — твоя мать. Небо — твой отец.",
            "Корни — это доверие.",
            "Ветви — это открытость.",
            "В тебе живёт баланс.",
            "Между глубиной и высотой.",
            "Между покоем и движением.",
            "Вдох — собирай свет.",
            "Выдох — отпускай тень.",
            "Корни крепнут с каждым циклом.",
            "Ствол становится сильнее.",
            "Ты — древо жизни.",
            "Укоренённый. Устойчивый. Живой.",
            "Корень тела — это твой дом."
        ]
    )
]

// MARK: - Text Splitting for Watch

/// Разбивает длинные тексты на части для лучшего отображения на часах
/// maxLength: максимальная длина текста (по умолчанию 50 символов для Watch)
func splitLongTexts(_ texts: [String], maxLength: Int = 50) -> [String] {
    var result: [String] = []
    
    for text in texts {
        if text.count <= maxLength {
            result.append(text)
        } else {
            // Разбить текст на части
            let parts = splitTextIntoParts(text, maxLength: maxLength)
            result.append(contentsOf: parts)
        }
    }
    
    return result
}

/// Разбивает один длинный текст на части по ближайшему разделителю
func splitTextIntoParts(_ text: String, maxLength: Int) -> [String] {
    var parts: [String] = []
    var remaining = text
    
    while remaining.count > maxLength {
        // Ищем место для разбиения (приоритет: \n, ., пробел)
        let searchRange = remaining.prefix(maxLength + 10) // небольшой запас
        
        var splitIndex: String.Index? = nil
        
        // 1. Сначала ищем \n
        if let newlineRange = searchRange.range(of: "\n", options: .backwards) {
            splitIndex = newlineRange.lowerBound
        }
        // 2. Затем точку с пробелом
        else if let periodRange = searchRange.range(of: ". ", options: .backwards) {
            splitIndex = searchRange.index(after: periodRange.lowerBound)
        }
        // 3. Затем просто пробел ближе к середине
        else {
            let midPoint = remaining.index(remaining.startIndex, offsetBy: min(maxLength, remaining.count))
            let searchBack = remaining[..<midPoint]
            if let spaceRange = searchBack.range(of: " ", options: .backwards) {
                splitIndex = spaceRange.upperBound
            }
        }
        
        // Если нашли место для разбиения
        if let idx = splitIndex, idx > remaining.startIndex {
            let part = String(remaining[..<idx]).trimmingCharacters(in: .whitespacesAndNewlines)
            if !part.isEmpty {
                parts.append(part)
            }
            remaining = String(remaining[idx...]).trimmingCharacters(in: .whitespacesAndNewlines)
        } else {
            // Не нашли хорошее место — берём первые maxLength символов
            let cutIndex = remaining.index(remaining.startIndex, offsetBy: min(maxLength, remaining.count))
            let part = String(remaining[..<cutIndex]).trimmingCharacters(in: .whitespacesAndNewlines)
            if !part.isEmpty {
                parts.append(part)
            }
            remaining = String(remaining[cutIndex...]).trimmingCharacters(in: .whitespacesAndNewlines)
        }
    }
    
    // Добавляем остаток
    let trimmed = remaining.trimmingCharacters(in: .whitespacesAndNewlines)
    if !trimmed.isEmpty {
        parts.append(trimmed)
    }
    
    return parts
}

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
    
    @objc func sendAudioToWatch(_ call: CAPPluginCall) {
        guard let practiceId = call.getString("practiceId") else {
            call.reject("Missing practiceId")
            return
        }
        
        guard let filePath = call.getString("filePath") else {
            call.reject("Missing filePath")
            return
        }
        
        let fileURL = URL(fileURLWithPath: filePath)
        
        guard FileManager.default.fileExists(atPath: filePath) else {
            call.reject("File not found: \(filePath)")
            return
        }
        
        print("[ONDA Plugin] sendAudioToWatch: \(practiceId), file: \(fileURL.lastPathComponent)")
        implementation.sendAudioToWatch(practiceId: practiceId, fileURL: fileURL)
        call.resolve()
    }
    
    @objc func sendAudioProgress(_ call: CAPPluginCall) {
        guard let progress = call.getString("progress") else {
            call.reject("Missing progress")
            return
        }
        
        implementation.sendAudioProgress(progress: progress)
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
        // Apply text splitting for better Watch display
        let practices: [[String: Any]] = part1Practices.map { practice in
            let splitTexts = splitLongTexts(practice.guidingTexts, maxLength: 50)
            return [
                "id": practice.id,
                "name": practice.name,
                "duration": practice.duration,
                "targetTime": practice.targetTime,
                "guidingTexts": splitTexts
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
        
        // Apply text splitting for better Watch display
        let splitTexts = splitLongTexts(practice.guidingTexts, maxLength: 50)
        
        let message: [String: Any] = [
            "type": "practiceData",
            "id": practice.id,
            "name": practice.name,
            "targetTime": practice.targetTime,
            "guidingTexts": splitTexts,
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
            
        case "requestAudio":
            // Watch requests audio file for a practice
            if let practiceId = data["practiceId"] as? String {
                addDebugLog("Watch requests audio for: \(practiceId)")
                // Download audio from CDN and send to Watch
                downloadAndSendAudio(practiceId: practiceId)
            }

        default:
            addDebugLog("Unknown: \(type)")
        }
    }
    
    // MARK: - Audio Transfer to Watch
    
    private let audioBaseURL = "https://ilckshuxgvrbmibmfpaq.supabase.co/storage/v1/object/public/audio-practices"
    
    // Practice ID to audio paths mapping (all tracks per practice)
    private let practiceAudioMap: [String: [String]] = [
        "p1-1": ["p1-1_Breath of Life/p1-1_Breath of Life-1.mp3", "p1-1_Breath of Life/p1-1_Breath of Life-2.mp3"],
        "p1-2": ["p1-2_Sense of Being/p1-2_Sense of Being-1.mp3", "p1-2_Sense of Being/p1-2_Sense of Being-2.mp3"],
        "p1-3": ["p1-3_Warm Pulse/p1-3_Warm Pulse-1.mp3", "p1-3_Warm Pulse/p1-3_Warm Pulse-2.mp3"],
        "p1-4": ["p1-4_Still Wave/p1-4_Still Wave-1.mp3", "p1-4_Still Wave/p1-4_Still Wave-2.mp3"],
        "p1-5": ["p1-5_Inner Listening/p1-5_Inner Listening-1.mp3", "p1-5_Inner Listening/p1-5_Inner Listening-2.mp3"],
        "p1-6": ["p1-6_First Light/p1-6_First Light-1.mp3", "p1-6_First Light/p1-6_First Light-2.mp3"],
        "p1-7": ["p1-7_Liquid Presence/p1-7_Liquid Presence-1.mp3", "p1-7_Liquid Presence/p1-7_Liquid Presence-2.mp3"],
        "p1-8": ["p1-8_Breath Counting/p1-8_Breath Counting-1.mp3", "p1-8_Breath Counting/p1-8_Breath Counting-2.mp3"],
        "p1-9": ["p1-9_Point of Stillness/p1-9_Point of Stillness-1.mp3", "p1-9_Point of Stillness/p1-9_Point of Stillness-2.mp3", "p1-9_Point of Stillness/p1-9_Point of Stillness-3.mp3"],
        "p1-10": ["p1-10_I Am Stillness/p1-10_I Am Stillness-1.mp3", "p1-10_I Am Stillness/p1-10_I Am Stillness-2.mp3", "p1-10_I Am Stillness/p1-10_I Am Stillness-3.mp3"],
        "p1-11": ["p1-11_Earth Flow/p1-11_Earth Flow-1.mp3", "p1-11_Earth Flow/p1-11_Earth Flow-2.mp3", "p1-11_Earth Flow/p1-11_Earth Flow-3.mp3", "p1-11_Earth Flow/p1-11_Earth Flow-4.mp3"],
        "p1-12": ["p1-12_Body Root/p1-12_Body Root-1.mp3", "p1-12_Body Root/p1-12_Body Root-2.mp3", "p1-12_Body Root/p1-12_Body Root-3.mp3", "p1-12_Body Root/p1-12_Body Root-4.mp3"]
    ]
    
    /// Download audio from CDN and send to Watch
    /// Downloads first track only for faster start, watch loops it
    func downloadAndSendAudio(practiceId: String) {
        guard let audioPaths = practiceAudioMap[practiceId], !audioPaths.isEmpty else {
            addDebugLog("No audio paths for: \(practiceId)")
            sendAudioProgress(progress: "Audio not found")
            return
        }
        
        // Use first track for quick start
        let audioPath = audioPaths[0]
        
        // Check if already cached on iPhone
        let fileManager = FileManager.default
        let documentsURL = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
        let cachedURL = documentsURL.appendingPathComponent("audio_\(practiceId).mp3")
        
        if fileManager.fileExists(atPath: cachedURL.path) {
            addDebugLog("Using cached audio for \(practiceId)")
            sendAudioToWatch(practiceId: practiceId, fileURL: cachedURL)
            return
        }
        
        // Download from CDN
        // Replace spaces with %20 for URL encoding
        let encodedPath = audioPath.replacingOccurrences(of: " ", with: "%20")
        guard let downloadURL = URL(string: "\(audioBaseURL)/\(encodedPath)") else {
            addDebugLog("Invalid audio URL: \(audioBaseURL)/\(encodedPath)")
            sendAudioProgress(progress: "URL error")
            return
        }
        
        addDebugLog("Audio URL: \(downloadURL.absoluteString)")
        
        addDebugLog("Downloading: \(audioPath)")
        sendAudioProgress(progress: "Downloading...")
        
        let task = URLSession.shared.downloadTask(with: downloadURL) { [weak self] tempURL, response, error in
            guard let self = self else { return }
            
            if let error = error {
                self.addDebugLog("Download error: \(error.localizedDescription)")
                self.sendAudioProgress(progress: "Download failed")
                return
            }
            
            guard let tempURL = tempURL else {
                self.addDebugLog("No temp file")
                self.sendAudioProgress(progress: "Download failed")
                return
            }
            
            do {
                // Remove existing file if present
                if fileManager.fileExists(atPath: cachedURL.path) {
                    try fileManager.removeItem(at: cachedURL)
                }
                
                // Move downloaded file to cache
                try fileManager.moveItem(at: tempURL, to: cachedURL)
                
                self.addDebugLog("Downloaded and cached: \(practiceId)")
                self.sendAudioProgress(progress: "Sending to Watch...")
                
                // Send to Watch
                self.sendAudioToWatch(practiceId: practiceId, fileURL: cachedURL)
                
            } catch {
                self.addDebugLog("Cache error: \(error.localizedDescription)")
                self.sendAudioProgress(progress: "Cache error")
            }
        }
        
        task.resume()
    }
    
    /// Send audio file to Watch
    func sendAudioToWatch(practiceId: String, fileURL: URL) {
        guard let session = session else {
            print("[ONDA Manager] No session for audio transfer")
            return
        }
        
        guard session.isPaired && session.isWatchAppInstalled else {
            print("[ONDA Manager] Watch not paired or app not installed")
            return
        }
        
        // Transfer file with metadata
        let metadata: [String: Any] = [
            "practiceId": practiceId,
            "ts": Date().timeIntervalSince1970
        ]
        
        print("[ONDA Manager] Transferring audio to Watch: \(fileURL.lastPathComponent)")
        
        session.transferFile(fileURL, metadata: metadata)
    }
    
    /// Send progress update to Watch
    func sendAudioProgress(progress: String) {
        guard let session = session, session.isReachable else { return }
        
        let message: [String: Any] = [
            "type": "audioProgress",
            "progress": progress,
            "ts": Date().timeIntervalSince1970
        ]
        
        session.sendMessage(message, replyHandler: nil) { error in
            print("[ONDA Manager] audioProgress error: \(error)")
        }
    }
    
    // MARK: - WCSession File Transfer Delegate
    
    func session(_ session: WCSession, didFinish fileTransfer: WCSessionFileTransfer, error: Error?) {
        if let error = error {
            addDebugLog("File transfer failed: \(error.localizedDescription)")
            sendAudioProgress(progress: "Transfer failed")
        } else {
            if let practiceId = fileTransfer.file.metadata?["practiceId"] as? String {
                addDebugLog("File transfer complete: \(practiceId)")
            }
            // Audio ready notification sent from Watch side when it receives the file
        }
    }
}
