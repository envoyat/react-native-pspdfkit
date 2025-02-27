import Foundation
import PSPDFKit

@objc public class PDFMemoryManager: NSObject {
    
    private static var activeDocumentPaths = NSMutableSet()
    private static var lastUsedTimes = NSMutableDictionary()
    
    @objc public static func registerDocument(path: String) {
        DispatchQueue.main.async {
            activeDocumentPaths.add(path)
            lastUsedTimes.setObject(Date(), forKey: path as NSString)
            
            // If too many documents are open, force close oldest
            if activeDocumentPaths.count > 1 {
                cleanupOldestDocument()
            }
        }
    }
    
    @objc public static func cleanupDocument(path: String) {
        DispatchQueue.main.async {
            if activeDocumentPaths.contains(path) {
                activeDocumentPaths.remove(path)
                PSPDFKit.SDK.shared.documentRegistry.forEach({ document in
                    if document.documentProviders.first?.fileURL.path == path {
                        // Force document closure
                        document.cancelFindString()
                        document.clearCache()
                        PSPDFKit.SDK.shared.cache.invalidateImages(from: document)
                    }
                })
                // We'll rely on the RCTPSPDFKitManager methods to handle this
            }
        }
    }
    
    @objc public static func cleanupOldestDocument() {
        guard activeDocumentPaths.count > 0 else { return }
        
        var oldestPath: String?
        var oldestDate = Date()
        
        // Find oldest document
        for path in activeDocumentPaths {
            guard let path = path as? String,
                  let date = lastUsedTimes.object(forKey: path) as? Date else { continue }
            
            if date.compare(oldestDate) == .orderedAscending {
                oldestDate = date
                oldestPath = path
            }
        }
        
        if let path = oldestPath {
            cleanupDocument(path: path)
        }
    }
    
    @objc public static func forceGlobalCleanup() {
        DispatchQueue.main.async {
            // Clear SDK caches
            PSPDFKit.SDK.shared.cache.clear()
            PSPDFKit.SDK.shared.renderManager.purgeCache()
            PSPDFKit.SDK.shared.backgroundColor = .white
            
            // Force GC
            autoreleasepool {
                for path in activeDocumentPaths.copy() as! Set<String> {
                    cleanupDocument(path: path)
                }
                activeDocumentPaths.removeAllObjects()
            }
            
            // We'll rely on the RCTPSPDFKitManager methods to handle this
        }
    }
} 