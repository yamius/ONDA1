//
//  NotificationManager.swift
//  OndaWatch Watch App
//

import Foundation
import UserNotifications
import WatchKit

class NotificationManager: NSObject, UNUserNotificationCenterDelegate {
    static let shared = NotificationManager()
    
    private let categoryIdentifier = "ONDA_OPEN_APP"
    private let actionIdentifier = "OPEN_APP_ACTION"
    
    override init() {
        super.init()
        setupNotifications()
    }
    
    private func setupNotifications() {
        let center = UNUserNotificationCenter.current()
        center.delegate = self
        
        center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                print("[NotificationManager] Notification permission granted")
                self.registerCategories()
            } else {
                print("[NotificationManager] Notification permission denied: \(error?.localizedDescription ?? "unknown")")
            }
        }
    }
    
    private func registerCategories() {
        let openAction = UNNotificationAction(
            identifier: actionIdentifier,
            title: "Открыть",
            options: [.foreground]
        )
        
        let category = UNNotificationCategory(
            identifier: categoryIdentifier,
            actions: [openAction],
            intentIdentifiers: [],
            options: [.customDismissAction]
        )
        
        UNUserNotificationCenter.current().setNotificationCategories([category])
        print("[NotificationManager] Categories registered")
    }
    
    func showOpenAppNotification() {
        let content = UNMutableNotificationContent()
        content.title = "ONDA"
        content.body = "Откройте для медитации"
        content.sound = .default
        content.categoryIdentifier = categoryIdentifier
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 0.5, repeats: false)
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("[NotificationManager] Failed to schedule notification: \(error)")
            } else {
                print("[NotificationManager] Notification scheduled")
                WKInterfaceDevice.current().play(.notification)
            }
        }
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound])
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse,
                                withCompletionHandler completionHandler: @escaping () -> Void) {
        print("[NotificationManager] User tapped notification, action: \(response.actionIdentifier)")
        
        if response.actionIdentifier == actionIdentifier || 
           response.actionIdentifier == UNNotificationDefaultActionIdentifier {
            DispatchQueue.main.async {
                WorkoutManager.shared.startWorkout()
            }
        }
        
        completionHandler()
    }
}
