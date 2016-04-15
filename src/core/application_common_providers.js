'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var di_1 = require('angular2/src/core/di');
var application_tokens_1 = require('./application_tokens');
var change_detection_1 = require('./change_detection/change_detection');
var resolved_metadata_cache_1 = require('angular2/src/core/linker/resolved_metadata_cache');
var view_manager_1 = require('./linker/view_manager');
var view_manager_2 = require("./linker/view_manager");
var view_resolver_1 = require('./linker/view_resolver');
var directive_resolver_1 = require('./linker/directive_resolver');
var pipe_resolver_1 = require('./linker/pipe_resolver');
var compiler_1 = require('./linker/compiler');
var compiler_2 = require("./linker/compiler");
var dynamic_component_loader_1 = require('./linker/dynamic_component_loader');
var dynamic_component_loader_2 = require("./linker/dynamic_component_loader");
/**
 * A default set of providers which should be included in any Angular
 * application, regardless of the platform it runs onto.
 */
exports.APPLICATION_COMMON_PROVIDERS = lang_1.CONST_EXPR([
    new di_1.Provider(compiler_1.Compiler, { useClass: compiler_2.Compiler_ }),
    application_tokens_1.APP_ID_RANDOM_PROVIDER,
    resolved_metadata_cache_1.ResolvedMetadataCache,
    new di_1.Provider(view_manager_1.AppViewManager, { useClass: view_manager_2.AppViewManager_ }),
    view_resolver_1.ViewResolver,
    new di_1.Provider(change_detection_1.IterableDiffers, { useValue: change_detection_1.defaultIterableDiffers }),
    new di_1.Provider(change_detection_1.KeyValueDiffers, { useValue: change_detection_1.defaultKeyValueDiffers }),
    directive_resolver_1.DirectiveResolver,
    pipe_resolver_1.PipeResolver,
    new di_1.Provider(dynamic_component_loader_1.DynamicComponentLoader, { useClass: dynamic_component_loader_2.DynamicComponentLoader_ })
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fY29tbW9uX3Byb3ZpZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtc0JOQXF2aTQudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2FwcGxpY2F0aW9uX2NvbW1vbl9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUErQiwwQkFBMEIsQ0FBQyxDQUFBO0FBQzFELG1CQUF1RCxzQkFBc0IsQ0FBQyxDQUFBO0FBQzlFLG1DQUlPLHNCQUFzQixDQUFDLENBQUE7QUFDOUIsaUNBS08scUNBQXFDLENBQUMsQ0FBQTtBQUM3Qyx3Q0FBb0Msa0RBQWtELENBQUMsQ0FBQTtBQUN2Riw2QkFBNkIsdUJBQXVCLENBQUMsQ0FBQTtBQUNyRCw2QkFBOEIsdUJBQXVCLENBQUMsQ0FBQTtBQUN0RCw4QkFBMkIsd0JBQXdCLENBQUMsQ0FBQTtBQUNwRCxtQ0FBZ0MsNkJBQTZCLENBQUMsQ0FBQTtBQUM5RCw4QkFBMkIsd0JBQXdCLENBQUMsQ0FBQTtBQUNwRCx5QkFBdUIsbUJBQW1CLENBQUMsQ0FBQTtBQUMzQyx5QkFBd0IsbUJBQW1CLENBQUMsQ0FBQTtBQUM1Qyx5Q0FBcUMsbUNBQW1DLENBQUMsQ0FBQTtBQUN6RSx5Q0FBc0MsbUNBQW1DLENBQUMsQ0FBQTtBQUUxRTs7O0dBR0c7QUFDVSxvQ0FBNEIsR0FBbUMsaUJBQVUsQ0FBQztJQUNyRixJQUFJLGFBQVEsQ0FBQyxtQkFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLG9CQUFTLEVBQUMsQ0FBQztJQUM3QywyQ0FBc0I7SUFDdEIsK0NBQXFCO0lBQ3JCLElBQUksYUFBUSxDQUFDLDZCQUFjLEVBQUUsRUFBQyxRQUFRLEVBQUUsOEJBQWUsRUFBQyxDQUFDO0lBQ3pELDRCQUFZO0lBQ1osSUFBSSxhQUFRLENBQUMsa0NBQWUsRUFBRSxFQUFDLFFBQVEsRUFBRSx5Q0FBc0IsRUFBQyxDQUFDO0lBQ2pFLElBQUksYUFBUSxDQUFDLGtDQUFlLEVBQUUsRUFBQyxRQUFRLEVBQUUseUNBQXNCLEVBQUMsQ0FBQztJQUNqRSxzQ0FBaUI7SUFDakIsNEJBQVk7SUFDWixJQUFJLGFBQVEsQ0FBQyxpREFBc0IsRUFBRSxFQUFDLFFBQVEsRUFBRSxrREFBdUIsRUFBQyxDQUFDO0NBQzFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VHlwZSwgQ09OU1RfRVhQUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7cHJvdmlkZSwgUHJvdmlkZXIsIEluamVjdG9yLCBPcGFxdWVUb2tlbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtcbiAgQVBQX0NPTVBPTkVOVF9SRUZfUFJPTUlTRSxcbiAgQVBQX0NPTVBPTkVOVCxcbiAgQVBQX0lEX1JBTkRPTV9QUk9WSURFUlxufSBmcm9tICcuL2FwcGxpY2F0aW9uX3Rva2Vucyc7XG5pbXBvcnQge1xuICBJdGVyYWJsZURpZmZlcnMsXG4gIGRlZmF1bHRJdGVyYWJsZURpZmZlcnMsXG4gIEtleVZhbHVlRGlmZmVycyxcbiAgZGVmYXVsdEtleVZhbHVlRGlmZmVyc1xufSBmcm9tICcuL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdGlvbic7XG5pbXBvcnQge1Jlc29sdmVkTWV0YWRhdGFDYWNoZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3Jlc29sdmVkX21ldGFkYXRhX2NhY2hlJztcbmltcG9ydCB7QXBwVmlld01hbmFnZXJ9IGZyb20gJy4vbGlua2VyL3ZpZXdfbWFuYWdlcic7XG5pbXBvcnQge0FwcFZpZXdNYW5hZ2VyX30gZnJvbSBcIi4vbGlua2VyL3ZpZXdfbWFuYWdlclwiO1xuaW1wb3J0IHtWaWV3UmVzb2x2ZXJ9IGZyb20gJy4vbGlua2VyL3ZpZXdfcmVzb2x2ZXInO1xuaW1wb3J0IHtEaXJlY3RpdmVSZXNvbHZlcn0gZnJvbSAnLi9saW5rZXIvZGlyZWN0aXZlX3Jlc29sdmVyJztcbmltcG9ydCB7UGlwZVJlc29sdmVyfSBmcm9tICcuL2xpbmtlci9waXBlX3Jlc29sdmVyJztcbmltcG9ydCB7Q29tcGlsZXJ9IGZyb20gJy4vbGlua2VyL2NvbXBpbGVyJztcbmltcG9ydCB7Q29tcGlsZXJffSBmcm9tIFwiLi9saW5rZXIvY29tcGlsZXJcIjtcbmltcG9ydCB7RHluYW1pY0NvbXBvbmVudExvYWRlcn0gZnJvbSAnLi9saW5rZXIvZHluYW1pY19jb21wb25lbnRfbG9hZGVyJztcbmltcG9ydCB7RHluYW1pY0NvbXBvbmVudExvYWRlcl99IGZyb20gXCIuL2xpbmtlci9keW5hbWljX2NvbXBvbmVudF9sb2FkZXJcIjtcblxuLyoqXG4gKiBBIGRlZmF1bHQgc2V0IG9mIHByb3ZpZGVycyB3aGljaCBzaG91bGQgYmUgaW5jbHVkZWQgaW4gYW55IEFuZ3VsYXJcbiAqIGFwcGxpY2F0aW9uLCByZWdhcmRsZXNzIG9mIHRoZSBwbGF0Zm9ybSBpdCBydW5zIG9udG8uXG4gKi9cbmV4cG9ydCBjb25zdCBBUFBMSUNBVElPTl9DT01NT05fUFJPVklERVJTOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4gPSBDT05TVF9FWFBSKFtcbiAgbmV3IFByb3ZpZGVyKENvbXBpbGVyLCB7dXNlQ2xhc3M6IENvbXBpbGVyX30pLFxuICBBUFBfSURfUkFORE9NX1BST1ZJREVSLFxuICBSZXNvbHZlZE1ldGFkYXRhQ2FjaGUsXG4gIG5ldyBQcm92aWRlcihBcHBWaWV3TWFuYWdlciwge3VzZUNsYXNzOiBBcHBWaWV3TWFuYWdlcl99KSxcbiAgVmlld1Jlc29sdmVyLFxuICBuZXcgUHJvdmlkZXIoSXRlcmFibGVEaWZmZXJzLCB7dXNlVmFsdWU6IGRlZmF1bHRJdGVyYWJsZURpZmZlcnN9KSxcbiAgbmV3IFByb3ZpZGVyKEtleVZhbHVlRGlmZmVycywge3VzZVZhbHVlOiBkZWZhdWx0S2V5VmFsdWVEaWZmZXJzfSksXG4gIERpcmVjdGl2ZVJlc29sdmVyLFxuICBQaXBlUmVzb2x2ZXIsXG4gIG5ldyBQcm92aWRlcihEeW5hbWljQ29tcG9uZW50TG9hZGVyLCB7dXNlQ2xhc3M6IER5bmFtaWNDb21wb25lbnRMb2FkZXJffSlcbl0pOyJdfQ==