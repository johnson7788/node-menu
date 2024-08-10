import MindElixir from 'mind-elixir'
import example from 'mind-elixir/example'

import nodeMenu from './nodeMenu'
// import nodeMenu from '@mind-elixir/plugin-name'

const app = document.querySelector('#app')
app.style.marginTop = '50px'
app.style.height = '800px'
app.style.width = '100%'

const options = {
  el: app,
  newTopicName: '子节点',
  direction: MindElixir.SIDE,
  // direction: MindElixir.RIGHT,
  locale: 'en',
  draggable: true,
  editable: true,
  contextMenu: true,
  contextMenuOption: {
    focus: true,
    link: true,
    extend: [
      {
        name: 'Node edit',
        onclick: () => {
          alert('extend menu')
        },
      },
    ],
  },
  toolBar: true,
  keypress: true,
  allowUndo: false,
  before: {
    moveDownNode() {
      return false
    },
    insertSibling(el, obj) {
      console.log('insertSibling', el, obj)
      return true
    },
    async addChild(el, obj) {
      console.log('addChild', el, obj)
      // await sleep()
      return true
    },
  },
  primaryLinkStyle: 1,
  primaryNodeVerticalGap: 15, // 25
  primaryNodeHorizontalGap: 15, // 65
  apiInterface: {
    singleNode: false, //生成单个节点
    answerAPI: "http://localhost:5554/mind/answer",
    uploadAPI: "http://localhost:5554/mind/upload_file", //上传文件和图片
    listAPI: "http://localhost:5554/mind/get_mind_file_image", //获取文件，mind,文件，图片,列表
    headerToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyMjY3NjI0NywianRpIjoiNjRiMTI5ZGItYTI2Ny00Njc5LTk2ZDQtNDIyOWU2NjE0MDVjIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImpvaG5zb24iLCJuYmYiOjE3MjI2NzYyNDcsImNzcmYiOiIyZjc0Njc4Ni04YWE3LTRjY2EtOTgzMi1iZTcxOWFlMTYwOGMiLCJleHAiOjE3MjMyODEwNDd9.FwOx566ogh-IRRNuilZdHbj1LwHeGuhccP32F4bI5Rw", //上传文件和图片时，请求头中的token字段
  }
}

const mind = new MindElixir(options)
mind.install(nodeMenu)
const data = MindElixir.new('new topic')
mind.init(example) // or try `example`
function sleep() {
  return new Promise((res, rej) => {
    setTimeout(() => res(), 1000)
  })
}
console.log('test E function', MindElixir.E('bd4313fbac40284b'))
window.currentOperation = null
mind.bus.addListener('operation', (operation) => {
  console.log(operation)
  if (operation.name !== 'finishEdit') window.currentOperation = operation
  // return {
  //   name: action name,
  //   obj: target object
  // }

  // name: [insertSibling|addChild|removeNode|beginEdit|finishEdit]
  // obj: target

  // name: moveNode
  // obj: {from:target1,to:target2}
})
mind.bus.addListener('selectNode', (node) => {
  console.log(node)
})
mind.bus.addListener('expandNode', (node) => {
  console.log('expandNode: ', node)
})
window.m = mind
window.M = MindElixir
window.E = MindElixir.E
