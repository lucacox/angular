var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { RenderComponentType } from 'angular2/src/core/render/api';
import { ClientMessageBrokerFactory, FnArg, UiArguments } from "angular2/src/web_workers/shared/client_message_broker";
import { isPresent, isBlank } from "angular2/src/facade/lang";
import { ListWrapper } from 'angular2/src/facade/collection';
import { Injectable } from "angular2/src/core/di";
import { RenderStore } from 'angular2/src/web_workers/shared/render_store';
import { RENDERER_CHANNEL } from 'angular2/src/web_workers/shared/messaging_api';
import { Serializer, RenderStoreObject } from 'angular2/src/web_workers/shared/serializer';
import { EVENT_CHANNEL } from 'angular2/src/web_workers/shared/messaging_api';
import { MessageBus } from 'angular2/src/web_workers/shared/message_bus';
import { ObservableWrapper } from 'angular2/src/facade/async';
import { ViewEncapsulation } from 'angular2/src/core/metadata/view';
import { deserializeGenericEvent } from './event_deserializer';
export let WebWorkerRootRenderer = class WebWorkerRootRenderer {
    constructor(messageBrokerFactory, bus, _serializer, _renderStore) {
        this._serializer = _serializer;
        this._renderStore = _renderStore;
        this.globalEvents = new NamedEventEmitter();
        this._componentRenderers = new Map();
        this._messageBroker = messageBrokerFactory.createMessageBroker(RENDERER_CHANNEL);
        bus.initChannel(EVENT_CHANNEL);
        var source = bus.from(EVENT_CHANNEL);
        ObservableWrapper.subscribe(source, (message) => this._dispatchEvent(message));
    }
    _dispatchEvent(message) {
        var eventName = message['eventName'];
        var target = message['eventTarget'];
        var event = deserializeGenericEvent(message['event']);
        if (isPresent(target)) {
            this.globalEvents.dispatchEvent(eventNameWithTarget(target, eventName), event);
        }
        else {
            var element = this._serializer.deserialize(message['element'], RenderStoreObject);
            element.events.dispatchEvent(eventName, event);
        }
    }
    renderComponent(componentType) {
        var result = this._componentRenderers.get(componentType.id);
        if (isBlank(result)) {
            result = new WebWorkerRenderer(this, componentType);
            this._componentRenderers.set(componentType.id, result);
            var id = this._renderStore.allocateId();
            this._renderStore.store(result, id);
            this.runOnService('renderComponent', [
                new FnArg(componentType, RenderComponentType),
                new FnArg(result, RenderStoreObject),
            ]);
        }
        return result;
    }
    runOnService(fnName, fnArgs) {
        var args = new UiArguments(fnName, fnArgs);
        this._messageBroker.runOnService(args, null);
    }
    allocateNode() {
        var result = new WebWorkerRenderNode();
        var id = this._renderStore.allocateId();
        this._renderStore.store(result, id);
        return result;
    }
    allocateId() { return this._renderStore.allocateId(); }
    destroyNodes(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            this._renderStore.remove(nodes[i]);
        }
    }
};
WebWorkerRootRenderer = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [ClientMessageBrokerFactory, MessageBus, Serializer, RenderStore])
], WebWorkerRootRenderer);
export class WebWorkerRenderer {
    constructor(_rootRenderer, _componentType) {
        this._rootRenderer = _rootRenderer;
        this._componentType = _componentType;
    }
    renderComponent(componentType) {
        return this._rootRenderer.renderComponent(componentType);
    }
    _runOnService(fnName, fnArgs) {
        var fnArgsWithRenderer = [new FnArg(this, RenderStoreObject)].concat(fnArgs);
        this._rootRenderer.runOnService(fnName, fnArgsWithRenderer);
    }
    selectRootElement(selector) {
        var node = this._rootRenderer.allocateNode();
        this._runOnService('selectRootElement', [new FnArg(selector, null), new FnArg(node, RenderStoreObject)]);
        return node;
    }
    createElement(parentElement, name) {
        var node = this._rootRenderer.allocateNode();
        this._runOnService('createElement', [
            new FnArg(parentElement, RenderStoreObject),
            new FnArg(name, null),
            new FnArg(node, RenderStoreObject)
        ]);
        return node;
    }
    createViewRoot(hostElement) {
        var viewRoot = this._componentType.encapsulation === ViewEncapsulation.Native ?
            this._rootRenderer.allocateNode() :
            hostElement;
        this._runOnService('createViewRoot', [new FnArg(hostElement, RenderStoreObject), new FnArg(viewRoot, RenderStoreObject)]);
        return viewRoot;
    }
    createTemplateAnchor(parentElement) {
        var node = this._rootRenderer.allocateNode();
        this._runOnService('createTemplateAnchor', [new FnArg(parentElement, RenderStoreObject), new FnArg(node, RenderStoreObject)]);
        return node;
    }
    createText(parentElement, value) {
        var node = this._rootRenderer.allocateNode();
        this._runOnService('createText', [
            new FnArg(parentElement, RenderStoreObject),
            new FnArg(value, null),
            new FnArg(node, RenderStoreObject)
        ]);
        return node;
    }
    projectNodes(parentElement, nodes) {
        this._runOnService('projectNodes', [new FnArg(parentElement, RenderStoreObject), new FnArg(nodes, RenderStoreObject)]);
    }
    attachViewAfter(node, viewRootNodes) {
        this._runOnService('attachViewAfter', [new FnArg(node, RenderStoreObject), new FnArg(viewRootNodes, RenderStoreObject)]);
    }
    detachView(viewRootNodes) {
        this._runOnService('detachView', [new FnArg(viewRootNodes, RenderStoreObject)]);
    }
    destroyView(hostElement, viewAllNodes) {
        this._runOnService('destroyView', [new FnArg(hostElement, RenderStoreObject), new FnArg(viewAllNodes, RenderStoreObject)]);
        this._rootRenderer.destroyNodes(viewAllNodes);
    }
    setElementProperty(renderElement, propertyName, propertyValue) {
        this._runOnService('setElementProperty', [
            new FnArg(renderElement, RenderStoreObject),
            new FnArg(propertyName, null),
            new FnArg(propertyValue, null)
        ]);
    }
    setElementAttribute(renderElement, attributeName, attributeValue) {
        this._runOnService('setElementAttribute', [
            new FnArg(renderElement, RenderStoreObject),
            new FnArg(attributeName, null),
            new FnArg(attributeValue, null)
        ]);
    }
    setBindingDebugInfo(renderElement, propertyName, propertyValue) {
        this._runOnService('setBindingDebugInfo', [
            new FnArg(renderElement, RenderStoreObject),
            new FnArg(propertyName, null),
            new FnArg(propertyValue, null)
        ]);
    }
    setElementDebugInfo(renderElement, info) { }
    setElementClass(renderElement, className, isAdd) {
        this._runOnService('setElementClass', [
            new FnArg(renderElement, RenderStoreObject),
            new FnArg(className, null),
            new FnArg(isAdd, null)
        ]);
    }
    setElementStyle(renderElement, styleName, styleValue) {
        this._runOnService('setElementStyle', [
            new FnArg(renderElement, RenderStoreObject),
            new FnArg(styleName, null),
            new FnArg(styleValue, null)
        ]);
    }
    invokeElementMethod(renderElement, methodName, args) {
        this._runOnService('invokeElementMethod', [
            new FnArg(renderElement, RenderStoreObject),
            new FnArg(methodName, null),
            new FnArg(args, null)
        ]);
    }
    setText(renderNode, text) {
        this._runOnService('setText', [new FnArg(renderNode, RenderStoreObject), new FnArg(text, null)]);
    }
    listen(renderElement, name, callback) {
        renderElement.events.listen(name, callback);
        var unlistenCallbackId = this._rootRenderer.allocateId();
        this._runOnService('listen', [
            new FnArg(renderElement, RenderStoreObject),
            new FnArg(name, null),
            new FnArg(unlistenCallbackId, null)
        ]);
        return () => {
            renderElement.events.unlisten(name, callback);
            this._runOnService('listenDone', [new FnArg(unlistenCallbackId, null)]);
        };
    }
    listenGlobal(target, name, callback) {
        this._rootRenderer.globalEvents.listen(eventNameWithTarget(target, name), callback);
        var unlistenCallbackId = this._rootRenderer.allocateId();
        this._runOnService('listenGlobal', [new FnArg(target, null), new FnArg(name, null), new FnArg(unlistenCallbackId, null)]);
        return () => {
            this._rootRenderer.globalEvents.unlisten(eventNameWithTarget(target, name), callback);
            this._runOnService('listenDone', [new FnArg(unlistenCallbackId, null)]);
        };
    }
}
export class NamedEventEmitter {
    _getListeners(eventName) {
        if (isBlank(this._listeners)) {
            this._listeners = new Map();
        }
        var listeners = this._listeners.get(eventName);
        if (isBlank(listeners)) {
            listeners = [];
            this._listeners.set(eventName, listeners);
        }
        return listeners;
    }
    listen(eventName, callback) { this._getListeners(eventName).push(callback); }
    unlisten(eventName, callback) {
        ListWrapper.remove(this._getListeners(eventName), callback);
    }
    dispatchEvent(eventName, event) {
        var listeners = this._getListeners(eventName);
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](event);
        }
    }
}
function eventNameWithTarget(target, eventName) {
    return `${target}:${eventName}`;
}
export class WebWorkerRenderNode {
    constructor() {
        this.events = new NamedEventEmitter();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXdhQm5Mcm5TLnRtcC9hbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvd29ya2VyL3JlbmRlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBR0wsbUJBQW1CLEVBRXBCLE1BQU0sOEJBQThCO09BQzlCLEVBRUwsMEJBQTBCLEVBQzFCLEtBQUssRUFDTCxXQUFXLEVBQ1osTUFBTSx1REFBdUQ7T0FDdkQsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFRLE1BQU0sMEJBQTBCO09BQzNELEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO09BQ25ELEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCO09BQ3hDLEVBQUMsV0FBVyxFQUFDLE1BQU0sOENBQThDO09BQ2pFLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwrQ0FBK0M7T0FDdkUsRUFBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSw0Q0FBNEM7T0FDakYsRUFBQyxhQUFhLEVBQUMsTUFBTSwrQ0FBK0M7T0FDcEUsRUFBQyxVQUFVLEVBQUMsTUFBTSw2Q0FBNkM7T0FDL0QsRUFBZSxpQkFBaUIsRUFBQyxNQUFNLDJCQUEyQjtPQUNsRSxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUNBQWlDO09BQzFELEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxzQkFBc0I7QUFHNUQ7SUFNRSxZQUFZLG9CQUFnRCxFQUFFLEdBQWUsRUFDekQsV0FBdUIsRUFBVSxZQUF5QjtRQUExRCxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBTHZFLGlCQUFZLEdBQXNCLElBQUksaUJBQWlCLEVBQUUsQ0FBQztRQUN6RCx3QkFBbUIsR0FDdkIsSUFBSSxHQUFHLEVBQTZCLENBQUM7UUFJdkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxt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Q0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRUQsNkJBQTZCLE1BQWMsRUFBRSxTQUFpQjtJQUM1RCxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7QUFDbEMsQ0FBQztBQUVEO0lBQUE7UUFBbUMsV0FBTSxHQUFzQixJQUFJLGlCQUFpQixFQUFFLENBQUM7SUFBQyxDQUFDO0FBQUQsQ0FBQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgUmVuZGVyZXIsXG4gIFJvb3RSZW5kZXJlcixcbiAgUmVuZGVyQ29tcG9uZW50VHlwZSxcbiAgUmVuZGVyRGVidWdJbmZvXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlbmRlci9hcGknO1xuaW1wb3J0IHtcbiAgQ2xpZW50TWVzc2FnZUJyb2tlcixcbiAgQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnksXG4gIEZuQXJnLFxuICBVaUFyZ3VtZW50c1xufSBmcm9tIFwiYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9jbGllbnRfbWVzc2FnZV9icm9rZXJcIjtcbmltcG9ydCB7aXNQcmVzZW50LCBpc0JsYW5rLCBwcmludH0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZ1wiO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcImFuZ3VsYXIyL3NyYy9jb3JlL2RpXCI7XG5pbXBvcnQge1JlbmRlclN0b3JlfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3JlbmRlcl9zdG9yZSc7XG5pbXBvcnQge1JFTkRFUkVSX0NIQU5ORUx9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvbWVzc2FnaW5nX2FwaSc7XG5pbXBvcnQge1NlcmlhbGl6ZXIsIFJlbmRlclN0b3JlT2JqZWN0fSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtFVkVOVF9DSEFOTkVMfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL21lc3NhZ2luZ19hcGknO1xuaW1wb3J0IHtNZXNzYWdlQnVzfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL21lc3NhZ2VfYnVzJztcbmltcG9ydCB7RXZlbnRFbWl0dGVyLCBPYnNlcnZhYmxlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge1ZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YS92aWV3JztcbmltcG9ydCB7ZGVzZXJpYWxpemVHZW5lcmljRXZlbnR9IGZyb20gJy4vZXZlbnRfZGVzZXJpYWxpemVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFdlYldvcmtlclJvb3RSZW5kZXJlciBpbXBsZW1lbnRzIFJvb3RSZW5kZXJlciB7XG4gIHByaXZhdGUgX21lc3NhZ2VCcm9rZXI7XG4gIHB1YmxpYyBnbG9iYWxFdmVudHM6IE5hbWVkRXZlbnRFbWl0dGVyID0gbmV3IE5hbWVkRXZlbnRFbWl0dGVyKCk7XG4gIHByaXZhdGUgX2NvbXBvbmVudFJlbmRlcmVyczogTWFwPHN0cmluZywgV2ViV29ya2VyUmVuZGVyZXI+ID1cbiAgICAgIG5ldyBNYXA8c3RyaW5nLCBXZWJXb3JrZXJSZW5kZXJlcj4oKTtcblxuICBjb25zdHJ1Y3RvcihtZXNzYWdlQnJva2VyRmFjdG9yeTogQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnksIGJ1czogTWVzc2FnZUJ1cyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfc2VyaWFsaXplcjogU2VyaWFsaXplciwgcHJpdmF0ZSBfcmVuZGVyU3RvcmU6IFJlbmRlclN0b3JlKSB7XG4gICAgdGhpcy5fbWVzc2FnZUJyb2tlciA9IG1lc3NhZ2VCcm9rZXJGYWN0b3J5LmNyZWF0ZU1lc3NhZ2VCcm9rZXIoUkVOREVSRVJfQ0hBTk5FTCk7XG4gICAgYnVzLmluaXRDaGFubmVsKEVWRU5UX0NIQU5ORUwpO1xuICAgIHZhciBzb3VyY2UgPSBidXMuZnJvbShFVkVOVF9DSEFOTkVMKTtcbiAgICBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUoc291cmNlLCAobWVzc2FnZSkgPT4gdGhpcy5fZGlzcGF0Y2hFdmVudChtZXNzYWdlKSk7XG4gIH1cblxuICBwcml2YXRlIF9kaXNwYXRjaEV2ZW50KG1lc3NhZ2U6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogdm9pZCB7XG4gICAgdmFyIGV2ZW50TmFtZSA9IG1lc3NhZ2VbJ2V2ZW50TmFtZSddO1xuICAgIHZhciB0YXJnZXQgPSBtZXNzYWdlWydldmVudFRhcmdldCddO1xuICAgIHZhciBldmVudCA9IGRlc2VyaWFsaXplR2VuZXJpY0V2ZW50KG1lc3NhZ2VbJ2V2ZW50J10pO1xuICAgIGlmIChpc1ByZXNlbnQodGFyZ2V0KSkge1xuICAgICAgdGhpcy5nbG9iYWxFdmVudHMuZGlzcGF0Y2hFdmVudChldmVudE5hbWVXaXRoVGFyZ2V0KHRhcmdldCwgZXZlbnROYW1lKSwgZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZWxlbWVudCA9XG4gICAgICAgICAgPFdlYldvcmtlclJlbmRlck5vZGU+dGhpcy5fc2VyaWFsaXplci5kZXNlcmlhbGl6ZShtZXNzYWdlWydlbGVtZW50J10sIFJlbmRlclN0b3JlT2JqZWN0KTtcbiAgICAgIGVsZW1lbnQuZXZlbnRzLmRpc3BhdGNoRXZlbnQoZXZlbnROYW1lLCBldmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudFR5cGU6IFJlbmRlckNvbXBvbmVudFR5cGUpOiBSZW5kZXJlciB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuX2NvbXBvbmVudFJlbmRlcmVycy5nZXQoY29tcG9uZW50VHlwZS5pZCk7XG4gICAgaWYgKGlzQmxhbmsocmVzdWx0KSkge1xuICAgICAgcmVzdWx0ID0gbmV3IFdlYldvcmtlclJlbmRlcmVyKHRoaXMsIGNvbXBvbmVudFR5cGUpO1xuICAgICAgdGhpcy5fY29tcG9uZW50UmVuZGVyZXJzLnNldChjb21wb25lbnRUeXBlLmlkLCByZXN1bHQpO1xuICAgICAgdmFyIGlkID0gdGhpcy5fcmVuZGVyU3RvcmUuYWxsb2NhdGVJZCgpO1xuICAgICAgdGhpcy5fcmVuZGVyU3RvcmUuc3RvcmUocmVzdWx0LCBpZCk7XG4gICAgICB0aGlzLnJ1bk9uU2VydmljZSgncmVuZGVyQ29tcG9uZW50JywgW1xuICAgICAgICBuZXcgRm5BcmcoY29tcG9uZW50VHlwZSwgUmVuZGVyQ29tcG9uZW50VHlwZSksXG4gICAgICAgIG5ldyBGbkFyZyhyZXN1bHQsIFJlbmRlclN0b3JlT2JqZWN0KSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcnVuT25TZXJ2aWNlKGZuTmFtZTogc3RyaW5nLCBmbkFyZ3M6IEZuQXJnW10pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBVaUFyZ3VtZW50cyhmbk5hbWUsIGZuQXJncyk7XG4gICAgdGhpcy5fbWVzc2FnZUJyb2tlci5ydW5PblNlcnZpY2UoYXJncywgbnVsbCk7XG4gIH1cblxuICBhbGxvY2F0ZU5vZGUoKTogV2ViV29ya2VyUmVuZGVyTm9kZSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBXZWJXb3JrZXJSZW5kZXJOb2RlKCk7XG4gICAgdmFyIGlkID0gdGhpcy5fcmVuZGVyU3RvcmUuYWxsb2NhdGVJZCgpO1xuICAgIHRoaXMuX3JlbmRlclN0b3JlLnN0b3JlKHJlc3VsdCwgaWQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBhbGxvY2F0ZUlkKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9yZW5kZXJTdG9yZS5hbGxvY2F0ZUlkKCk7IH1cblxuICBkZXN0cm95Tm9kZXMobm9kZXM6IGFueVtdKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fcmVuZGVyU3RvcmUucmVtb3ZlKG5vZGVzW2ldKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYldvcmtlclJlbmRlcmVyIGltcGxlbWVudHMgUmVuZGVyZXIsIFJlbmRlclN0b3JlT2JqZWN0IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm9vdFJlbmRlcmVyOiBXZWJXb3JrZXJSb290UmVuZGVyZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NvbXBvbmVudFR5cGU6IFJlbmRlckNvbXBvbmVudFR5cGUpIHt9XG5cbiAgcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudFR5cGU6IFJlbmRlckNvbXBvbmVudFR5cGUpOiBSZW5kZXJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3RSZW5kZXJlci5yZW5kZXJDb21wb25lbnQoY29tcG9uZW50VHlwZSk7XG4gIH1cblxuICBwcml2YXRlIF9ydW5PblNlcnZpY2UoZm5OYW1lOiBzdHJpbmcsIGZuQXJnczogRm5BcmdbXSkge1xuICAgIHZhciBmbkFyZ3NXaXRoUmVuZGVyZXIgPSBbbmV3IEZuQXJnKHRoaXMsIFJlbmRlclN0b3JlT2JqZWN0KV0uY29uY2F0KGZuQXJncyk7XG4gICAgdGhpcy5fcm9vdFJlbmRlcmVyLnJ1bk9uU2VydmljZShmbk5hbWUsIGZuQXJnc1dpdGhSZW5kZXJlcik7XG4gIH1cblxuICBzZWxlY3RSb290RWxlbWVudChzZWxlY3Rvcjogc3RyaW5nKTogYW55IHtcbiAgICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3RSZW5kZXJlci5hbGxvY2F0ZU5vZGUoKTtcbiAgICB0aGlzLl9ydW5PblNlcnZpY2UoJ3NlbGVjdFJvb3RFbGVtZW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgW25ldyBGbkFyZyhzZWxlY3RvciwgbnVsbCksIG5ldyBGbkFyZyhub2RlLCBSZW5kZXJTdG9yZU9iamVjdCldKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGNyZWF0ZUVsZW1lbnQocGFyZW50RWxlbWVudDogYW55LCBuYW1lOiBzdHJpbmcpOiBhbnkge1xuICAgIHZhciBub2RlID0gdGhpcy5fcm9vdFJlbmRlcmVyLmFsbG9jYXRlTm9kZSgpO1xuICAgIHRoaXMuX3J1bk9uU2VydmljZSgnY3JlYXRlRWxlbWVudCcsIFtcbiAgICAgIG5ldyBGbkFyZyhwYXJlbnRFbGVtZW50LCBSZW5kZXJTdG9yZU9iamVjdCksXG4gICAgICBuZXcgRm5BcmcobmFtZSwgbnVsbCksXG4gICAgICBuZXcgRm5Bcmcobm9kZSwgUmVuZGVyU3RvcmVPYmplY3QpXG4gICAgXSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBjcmVhdGVWaWV3Um9vdChob3N0RWxlbWVudDogYW55KTogYW55IHtcbiAgICB2YXIgdmlld1Jvb3QgPSB0aGlzLl9jb21wb25lbnRUeXBlLmVuY2Fwc3VsYXRpb24gPT09IFZpZXdFbmNhcHN1bGF0aW9uLk5hdGl2ZSA/XG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3RSZW5kZXJlci5hbGxvY2F0ZU5vZGUoKSA6XG4gICAgICAgICAgICAgICAgICAgICAgIGhvc3RFbGVtZW50O1xuICAgIHRoaXMuX3J1bk9uU2VydmljZShcbiAgICAgICAgJ2NyZWF0ZVZpZXdSb290JyxcbiAgICAgICAgW25ldyBGbkFyZyhob3N0RWxlbWVudCwgUmVuZGVyU3RvcmVPYmplY3QpLCBuZXcgRm5Bcmcodmlld1Jvb3QsIFJlbmRlclN0b3JlT2JqZWN0KV0pO1xuICAgIHJldHVybiB2aWV3Um9vdDtcbiAgfVxuXG4gIGNyZWF0ZVRlbXBsYXRlQW5jaG9yKHBhcmVudEVsZW1lbnQ6IGFueSk6IGFueSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLl9yb290UmVuZGVyZXIuYWxsb2NhdGVOb2RlKCk7XG4gICAgdGhpcy5fcnVuT25TZXJ2aWNlKFxuICAgICAgICAnY3JlYXRlVGVtcGxhdGVBbmNob3InLFxuICAgICAgICBbbmV3IEZuQXJnKHBhcmVudEVsZW1lbnQsIFJlbmRlclN0b3JlT2JqZWN0KSwgbmV3IEZuQXJnKG5vZGUsIFJlbmRlclN0b3JlT2JqZWN0KV0pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgY3JlYXRlVGV4dChwYXJlbnRFbGVtZW50OiBhbnksIHZhbHVlOiBzdHJpbmcpOiBhbnkge1xuICAgIHZhciBub2RlID0gdGhpcy5fcm9vdFJlbmRlcmVyLmFsbG9jYXRlTm9kZSgpO1xuICAgIHRoaXMuX3J1bk9uU2VydmljZSgnY3JlYXRlVGV4dCcsIFtcbiAgICAgIG5ldyBGbkFyZyhwYXJlbnRFbGVtZW50LCBSZW5kZXJTdG9yZU9iamVjdCksXG4gICAgICBuZXcgRm5BcmcodmFsdWUsIG51bGwpLFxuICAgICAgbmV3IEZuQXJnKG5vZGUsIFJlbmRlclN0b3JlT2JqZWN0KVxuICAgIF0pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcHJvamVjdE5vZGVzKHBhcmVudEVsZW1lbnQ6IGFueSwgbm9kZXM6IGFueVtdKSB7XG4gICAgdGhpcy5fcnVuT25TZXJ2aWNlKFxuICAgICAgICAncHJvamVjdE5vZGVzJyxcbiAgICAgICAgW25ldyBGbkFyZyhwYXJlbnRFbGVtZW50LCBSZW5kZXJTdG9yZU9iamVjdCksIG5ldyBGbkFyZyhub2RlcywgUmVuZGVyU3RvcmVPYmplY3QpXSk7XG4gIH1cblxuICBhdHRhY2hWaWV3QWZ0ZXIobm9kZTogYW55LCB2aWV3Um9vdE5vZGVzOiBhbnlbXSkge1xuICAgIHRoaXMuX3J1bk9uU2VydmljZShcbiAgICAgICAgJ2F0dGFjaFZpZXdBZnRlcicsXG4gICAgICAgIFtuZXcgRm5Bcmcobm9kZSwgUmVuZGVyU3RvcmVPYmplY3QpLCBuZXcgRm5Bcmcodmlld1Jvb3ROb2RlcywgUmVuZGVyU3RvcmVPYmplY3QpXSk7XG4gIH1cblxuICBkZXRhY2hWaWV3KHZpZXdSb290Tm9kZXM6IGFueVtdKSB7XG4gICAgdGhpcy5fcnVuT25TZXJ2aWNlKCdkZXRhY2hWaWV3JywgW25ldyBGbkFyZyh2aWV3Um9vdE5vZGVzLCBSZW5kZXJTdG9yZU9iamVjdCldKTtcbiAgfVxuXG4gIGRlc3Ryb3lWaWV3KGhvc3RFbGVtZW50OiBhbnksIHZpZXdBbGxOb2RlczogYW55W10pIHtcbiAgICB0aGlzLl9ydW5PblNlcnZpY2UoXG4gICAgICAgICdkZXN0cm95VmlldycsXG4gICAgICAgIFtuZXcgRm5BcmcoaG9zdEVsZW1lbnQsIFJlbmRlclN0b3JlT2JqZWN0KSwgbmV3IEZuQXJnKHZpZXdBbGxOb2RlcywgUmVuZGVyU3RvcmVPYmplY3QpXSk7XG4gICAgdGhpcy5fcm9vdFJlbmRlcmVyLmRlc3Ryb3lOb2Rlcyh2aWV3QWxsTm9kZXMpO1xuICB9XG5cbiAgc2V0RWxlbWVudFByb3BlcnR5KHJlbmRlckVsZW1lbnQ6IGFueSwgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHByb3BlcnR5VmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3J1bk9uU2VydmljZSgnc2V0RWxlbWVudFByb3BlcnR5JywgW1xuICAgICAgbmV3IEZuQXJnKHJlbmRlckVsZW1lbnQsIFJlbmRlclN0b3JlT2JqZWN0KSxcbiAgICAgIG5ldyBGbkFyZyhwcm9wZXJ0eU5hbWUsIG51bGwpLFxuICAgICAgbmV3IEZuQXJnKHByb3BlcnR5VmFsdWUsIG51bGwpXG4gICAgXSk7XG4gIH1cblxuICBzZXRFbGVtZW50QXR0cmlidXRlKHJlbmRlckVsZW1lbnQ6IGFueSwgYXR0cmlidXRlTmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fcnVuT25TZXJ2aWNlKCdzZXRFbGVtZW50QXR0cmlidXRlJywgW1xuICAgICAgbmV3IEZuQXJnKHJlbmRlckVsZW1lbnQsIFJlbmRlclN0b3JlT2JqZWN0KSxcbiAgICAgIG5ldyBGbkFyZyhhdHRyaWJ1dGVOYW1lLCBudWxsKSxcbiAgICAgIG5ldyBGbkFyZyhhdHRyaWJ1dGVWYWx1ZSwgbnVsbClcbiAgICBdKTtcbiAgfVxuXG4gIHNldEJpbmRpbmdEZWJ1Z0luZm8ocmVuZGVyRWxlbWVudDogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHJvcGVydHlWYWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fcnVuT25TZXJ2aWNlKCdzZXRCaW5kaW5nRGVidWdJbmZvJywgW1xuICAgICAgbmV3IEZuQXJnKHJlbmRlckVsZW1lbnQsIFJlbmRlclN0b3JlT2JqZWN0KSxcbiAgICAgIG5ldyBGbkFyZyhwcm9wZXJ0eU5hbWUsIG51bGwpLFxuICAgICAgbmV3IEZuQXJnKHByb3BlcnR5VmFsdWUsIG51bGwpXG4gICAgXSk7XG4gIH1cblxuICBzZXRFbGVtZW50RGVidWdJbmZvKHJlbmRlckVsZW1lbnQ6IGFueSwgaW5mbzogUmVuZGVyRGVidWdJbmZvKSB7fVxuXG4gIHNldEVsZW1lbnRDbGFzcyhyZW5kZXJFbGVtZW50OiBhbnksIGNsYXNzTmFtZTogc3RyaW5nLCBpc0FkZDogYm9vbGVhbikge1xuICAgIHRoaXMuX3J1bk9uU2VydmljZSgnc2V0RWxlbWVudENsYXNzJywgW1xuICAgICAgbmV3IEZuQXJnKHJlbmRlckVsZW1lbnQsIFJlbmRlclN0b3JlT2JqZWN0KSxcbiAgICAgIG5ldyBGbkFyZyhjbGFzc05hbWUsIG51bGwpLFxuICAgICAgbmV3IEZuQXJnKGlzQWRkLCBudWxsKVxuICAgIF0pO1xuICB9XG5cbiAgc2V0RWxlbWVudFN0eWxlKHJlbmRlckVsZW1lbnQ6IGFueSwgc3R5bGVOYW1lOiBzdHJpbmcsIHN0eWxlVmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3J1bk9uU2VydmljZSgnc2V0RWxlbWVudFN0eWxlJywgW1xuICAgICAgbmV3IEZuQXJnKHJlbmRlckVsZW1lbnQsIFJlbmRlclN0b3JlT2JqZWN0KSxcbiAgICAgIG5ldyBGbkFyZyhzdHlsZU5hbWUsIG51bGwpLFxuICAgICAgbmV3IEZuQXJnKHN0eWxlVmFsdWUsIG51bGwpXG4gICAgXSk7XG4gIH1cblxuICBpbnZva2VFbGVtZW50TWV0aG9kKHJlbmRlckVsZW1lbnQ6IGFueSwgbWV0aG9kTmFtZTogc3RyaW5nLCBhcmdzOiBhbnlbXSkge1xuICAgIHRoaXMuX3J1bk9uU2VydmljZSgnaW52b2tlRWxlbWVudE1ldGhvZCcsIFtcbiAgICAgIG5ldyBGbkFyZyhyZW5kZXJFbGVtZW50LCBSZW5kZXJTdG9yZU9iamVjdCksXG4gICAgICBuZXcgRm5BcmcobWV0aG9kTmFtZSwgbnVsbCksXG4gICAgICBuZXcgRm5BcmcoYXJncywgbnVsbClcbiAgICBdKTtcbiAgfVxuXG4gIHNldFRleHQocmVuZGVyTm9kZTogYW55LCB0ZXh0OiBzdHJpbmcpIHtcbiAgICB0aGlzLl9ydW5PblNlcnZpY2UoJ3NldFRleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICBbbmV3IEZuQXJnKHJlbmRlck5vZGUsIFJlbmRlclN0b3JlT2JqZWN0KSwgbmV3IEZuQXJnKHRleHQsIG51bGwpXSk7XG4gIH1cblxuICBsaXN0ZW4ocmVuZGVyRWxlbWVudDogV2ViV29ya2VyUmVuZGVyTm9kZSwgbmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgcmVuZGVyRWxlbWVudC5ldmVudHMubGlzdGVuKG5hbWUsIGNhbGxiYWNrKTtcbiAgICB2YXIgdW5saXN0ZW5DYWxsYmFja0lkID0gdGhpcy5fcm9vdFJlbmRlcmVyLmFsbG9jYXRlSWQoKTtcbiAgICB0aGlzLl9ydW5PblNlcnZpY2UoJ2xpc3RlbicsIFtcbiAgICAgIG5ldyBGbkFyZyhyZW5kZXJFbGVtZW50LCBSZW5kZXJTdG9yZU9iamVjdCksXG4gICAgICBuZXcgRm5BcmcobmFtZSwgbnVsbCksXG4gICAgICBuZXcgRm5BcmcodW5saXN0ZW5DYWxsYmFja0lkLCBudWxsKVxuICAgIF0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZW5kZXJFbGVtZW50LmV2ZW50cy51bmxpc3RlbihuYW1lLCBjYWxsYmFjayk7XG4gICAgICB0aGlzLl9ydW5PblNlcnZpY2UoJ2xpc3RlbkRvbmUnLCBbbmV3IEZuQXJnKHVubGlzdGVuQ2FsbGJhY2tJZCwgbnVsbCldKTtcbiAgICB9O1xuICB9XG5cbiAgbGlzdGVuR2xvYmFsKHRhcmdldDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICB0aGlzLl9yb290UmVuZGVyZXIuZ2xvYmFsRXZlbnRzLmxpc3RlbihldmVudE5hbWVXaXRoVGFyZ2V0KHRhcmdldCwgbmFtZSksIGNhbGxiYWNrKTtcbiAgICB2YXIgdW5saXN0ZW5DYWxsYmFja0lkID0gdGhpcy5fcm9vdFJlbmRlcmVyLmFsbG9jYXRlSWQoKTtcbiAgICB0aGlzLl9ydW5PblNlcnZpY2UoXG4gICAgICAgICdsaXN0ZW5HbG9iYWwnLFxuICAgICAgICBbbmV3IEZuQXJnKHRhcmdldCwgbnVsbCksIG5ldyBGbkFyZyhuYW1lLCBudWxsKSwgbmV3IEZuQXJnKHVubGlzdGVuQ2FsbGJhY2tJZCwgbnVsbCldKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5fcm9vdFJlbmRlcmVyLmdsb2JhbEV2ZW50cy51bmxpc3RlbihldmVudE5hbWVXaXRoVGFyZ2V0KHRhcmdldCwgbmFtZSksIGNhbGxiYWNrKTtcbiAgICAgIHRoaXMuX3J1bk9uU2VydmljZSgnbGlzdGVuRG9uZScsIFtuZXcgRm5BcmcodW5saXN0ZW5DYWxsYmFja0lkLCBudWxsKV0pO1xuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5hbWVkRXZlbnRFbWl0dGVyIHtcbiAgcHJpdmF0ZSBfbGlzdGVuZXJzOiBNYXA8c3RyaW5nLCBGdW5jdGlvbltdPjtcblxuICBwcml2YXRlIF9nZXRMaXN0ZW5lcnMoZXZlbnROYW1lOiBzdHJpbmcpOiBGdW5jdGlvbltdIHtcbiAgICBpZiAoaXNCbGFuayh0aGlzLl9saXN0ZW5lcnMpKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgTWFwPHN0cmluZywgRnVuY3Rpb25bXT4oKTtcbiAgICB9XG4gICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoZXZlbnROYW1lKTtcbiAgICBpZiAoaXNCbGFuayhsaXN0ZW5lcnMpKSB7XG4gICAgICBsaXN0ZW5lcnMgPSBbXTtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5zZXQoZXZlbnROYW1lLCBsaXN0ZW5lcnMpO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdGVuZXJzO1xuICB9XG5cbiAgbGlzdGVuKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pIHsgdGhpcy5fZ2V0TGlzdGVuZXJzKGV2ZW50TmFtZSkucHVzaChjYWxsYmFjayk7IH1cblxuICB1bmxpc3RlbihldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgTGlzdFdyYXBwZXIucmVtb3ZlKHRoaXMuX2dldExpc3RlbmVycyhldmVudE5hbWUpLCBjYWxsYmFjayk7XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGV2ZW50TmFtZTogc3RyaW5nLCBldmVudDogYW55KSB7XG4gICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2dldExpc3RlbmVycyhldmVudE5hbWUpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0oZXZlbnQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBldmVudE5hbWVXaXRoVGFyZ2V0KHRhcmdldDogc3RyaW5nLCBldmVudE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBgJHt0YXJnZXR9OiR7ZXZlbnROYW1lfWA7XG59XG5cbmV4cG9ydCBjbGFzcyBXZWJXb3JrZXJSZW5kZXJOb2RlIHsgZXZlbnRzOiBOYW1lZEV2ZW50RW1pdHRlciA9IG5ldyBOYW1lZEV2ZW50RW1pdHRlcigpOyB9XG4iXX0=