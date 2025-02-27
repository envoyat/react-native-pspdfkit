#import <Foundation/Foundation.h>
@import PSPDFKit;

@interface PDFMemoryManager : NSObject

+ (void)registerDocument:(NSString *)path;
+ (void)cleanupDocument:(NSString *)path;
+ (void)cleanupOldestDocument;
+ (void)forceGlobalCleanup;

@end 