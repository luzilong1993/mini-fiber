const createTaskQueue = () => {
    const taskQueue = [];
    return {
        /**
         * 
         * @param {*} item 
         * @returns 向任务队列中添加任务
         */
        push: item => taskQueue.push(item),
        /**
         * 从任务队列中获取任务 -> 先进先出
         * @returns 
         */
        pop: () => taskQueue.shift(),
        /**
         * 判断任务队列中是否还有任务
         */
        isEmpty: () => taskQueue.length === 0
    }
}

export default createTaskQueue