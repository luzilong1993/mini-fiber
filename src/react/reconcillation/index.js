import { createTaskQueue,arrified,createStateNode,getTag } from '../Misc';

const taskQueue = createTaskQueue();
/**
 * 要执行的子任务
 */
let subTask = null;

let pendingCommit = null;

const commitAllWork = fiber => {
    fiber.effects.forEach(item => {
        if(item.effectTag === 'placement'){
            item.parent.stateNode.appendChild(item.stateNode)
        }
    })
}

const getFirstTask = () => {
    /**
     * 从任务队列中获取任务
     */
    const task = taskQueue.pop();
    /**
     * 返回最外层节点的fiber对象
     */
    return {
        props: task.props,
        stateNode: task.dom,
        tag: 'host_root',
        effects: [],
        child: null
    }
}

const reconcileChildren = (fiber,children) => {
    /**
     * children 可能是对象也可也能是数组
     * 将children转变为数据
     */
    const arrifiedChildern = arrified(children);
    
    let index = 0;
    let numberOfElement = arrifiedChildern.length;
    let element = null;
    let newFiber = null;
    let prevFiber = null;
    while(index < numberOfElement) {
        element = arrifiedChildern[index];
        /**
         * 子集fiber对象
         */
        newFiber = {
            type: element.type,
            props: element.props,
            tag: getTag(element),
            effects: [],
            effectTag: 'placement',
            parent: fiber,
        }

        /**
         * 为fiber节点添加DOM对象或组件实例对象
         */
        newFiber.stateNode = createStateNode(newFiber);


        // 为父级fiber添加子集fiber
        if(index === 0) {
            fiber.child = newFiber;
        } else {
            // 为fiber添加下一个兄弟fiber
            prevFiber.sibling = newFiber;
        }

        prevFiber = newFiber;

        index++
    }
    
    
}

const executeTask = (fiber) => {
    /**
     * 构建子集fiber对象
     */
    reconcileChildren(fiber,fiber.props.children);
    if(fiber.child) {
        return fiber.child
    }

    /**
     * 如果存在同级，返回同级，构建同级的子级
     * 如果同级不存在，返回到父级 看父级是否有同级
     */
    let currentExcutelyFiber = fiber;

    while (currentExcutelyFiber.parent) {
        currentExcutelyFiber.parent.effects = currentExcutelyFiber.parent.effects.concat(
            currentExcutelyFiber.effects.concat([currentExcutelyFiber])
        )
        if(currentExcutelyFiber.sibling) {
            return currentExcutelyFiber.sibling
        }
        currentExcutelyFiber = currentExcutelyFiber.parent
    }
    pendingCommit = currentExcutelyFiber;
}

const workLoop = deadline => {
    /**
     * 如果子任务不存在，获取子任务
     */
    if(!subTask) {
        subTask = getFirstTask();
    }
    /**
     * 如果任务存在并且浏览器有空余时间
     * executeTask 方法执行任务，接收子任务，返回新的任务
     */
    while(subTask && deadline.timeRemaining() > 1) {
        subTask = executeTask(subTask)
    }
    if(pendingCommit) {
        commitAllWork(pendingCommit)
    }
}

const performTask = (deadline) => {
    /**
     * 执行任务
     */
    workLoop(deadline);
    /**
     * 判断任务是否存在
     * 判断任务队列中是否还有任务没有执行
     * 再一次告诉浏览器在空闲的时间执行任务
     */
    if(subTask || !taskQueue.isEmpty()) {
        requestIdleCallback(performTask)
    }
}

export const render = (element, dom) => {
    /**
     * 1.向任务队列中添加任务
     * 2.指定在浏览器空闲时执行任务
     */
    /**
     * 任务就是通过vdom对象构建fiber对象
     */
    taskQueue.push({
        dom,
        props: {
            children: element
        }
    })
    /**
     * 指定在浏览器空闲时执行任务
     */
    requestIdleCallback(performTask)
}