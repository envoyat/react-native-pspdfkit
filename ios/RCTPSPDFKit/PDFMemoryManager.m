#import "PDFMemoryManager.h"

@implementation PDFMemoryManager

static NSMutableSet *activeDocumentPaths;
static NSMutableDictionary *lastUsedTimes;

+ (void)initialize {
    if (self == [PDFMemoryManager class]) {
        activeDocumentPaths = [NSMutableSet new];
        lastUsedTimes = [NSMutableDictionary new];
    }
}

+ (void)registerDocument:(NSString *)path {
    dispatch_async(dispatch_get_main_queue(), ^{
        [activeDocumentPaths addObject:path];
        [lastUsedTimes setObject:[NSDate date] forKey:path];
        
        if (activeDocumentPaths.count > 1) {
            [self cleanupOldestDocument];
        }
    });
}

+ (void)cleanupDocument:(NSString *)path {
    dispatch_async(dispatch_get_main_queue(), ^{
        if ([activeDocumentPaths containsObject:path]) {
            [activeDocumentPaths removeObject:path];
            
            for (PSPDFDocument *document in PSPDFKit.SDK.shared.documentRegistry) {
                PSPDFDocumentProvider *provider = document.documentProviders.firstObject;
                if ([provider.fileURL.path isEqualToString:path]) {
                    [document cancelFindString];
                    [document clearCache];
                    [PSPDFKit.SDK.shared.cache invalidateImagesFromDocument:document];
                }
            }
        }
    });
}

+ (void)cleanupOldestDocument {
    if (activeDocumentPaths.count == 0) return;
    
    NSString *oldestPath = nil;
    NSDate *oldestDate = [NSDate date];
    
    for (NSString *path in activeDocumentPaths) {
        NSDate *date = lastUsedTimes[path];
        if ([date compare:oldestDate] == NSOrderedAscending) {
            oldestDate = date;
            oldestPath = path;
        }
    }
    
    if (oldestPath) {
        [self cleanupDocument:oldestPath];
    }
}

+ (void)forceGlobalCleanup {
    dispatch_async(dispatch_get_main_queue(), ^{
        [PSPDFKit.SDK.shared.cache clear];
        [PSPDFKit.SDK.shared.renderManager purgeCache];
        
        NSSet *paths = [activeDocumentPaths copy];
        for (NSString *path in paths) {
            [self cleanupDocument:path];
        }
        [activeDocumentPaths removeAllObjects];
    });
}

@end 