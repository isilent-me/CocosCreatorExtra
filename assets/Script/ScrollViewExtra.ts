const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.ScrollView)
export default class ScrollViewExtra extends cc.Component {

    start () {
        this.addScrollBarExtra();
    }

    /** 增加scrollbar滑动事件，让滑动方向跟浏览器一样 */
    /** 该方法只增加了竖轴滑动事件，横轴事件同理 */
    addScrollBarExtra() {
        const scroll = this.node.getComponent(cc.ScrollView);
        const scrollnode:any = this.node;

        /** 手动禁用scroll节点捕获事件_capturingListeners */
        scrollnode._bubblingListeners = scrollnode._capturingListeners;
        scrollnode._capturingListeners = undefined;

        const scrollbar = scroll.verticalScrollBar;
        const handlenode = scrollbar.handle.node;

        let touching = false;

        function getMoveInterval(node:cc.Node,parent:cc.Node) {
            const handlesize = node.getContentSize();
            const parentSize = parent.getContentSize();
            let maxY = 0,minY = 0;
            if (parentSize.height > handlesize.height) {
                maxY = parentSize.height / 2 - handlesize.height;
                minY = - parentSize.height / 2;
            }
            return {minY,maxY};
        }

        handlenode.on(cc.Node.EventType.TOUCH_START,(e:cc.Event.EventTouch)=>{
            touching = true;
            e.stopPropagation();
        })
        handlenode.on(cc.Node.EventType.TOUCH_MOVE,(e:cc.Event.EventTouch)=>{
            const node = e.target;
            const {minY,maxY} = getMoveInterval(node,node.parent)
            node.y += e.getDelta().y
            if (node.y > maxY) {
                node.y = maxY;
            } else if (node.y < minY) {
                node.y = minY;
            }
            e.stopPropagation();
            let p = (node.y - minY) / (maxY - minY);
            scroll.scrollToPercentVertical(p);
        })
        handlenode.on(cc.Node.EventType.TOUCH_END,(e:cc.Event.EventTouch)=>{
            touching = false;
            e.stopPropagation();
        })
        handlenode.on(cc.Node.EventType.TOUCH_CANCEL,(e:cc.Event.EventTouch)=>{
            touching = false;
            e.stopPropagation();
        })
    }

}