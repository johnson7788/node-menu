import './nodeMenu.less'
import './icons/iconfont.js'
import i18n from './i18n.js'
import type { MindElixirInstance } from 'mind-elixir'

const createDiv = (id, innerHTML) => {
  const div = document.createElement('div')
  div.id = id
  div.innerHTML = innerHTML
  return div
}

const colorList = [
  '#2c3e50',
  '#34495e',
  '#7f8c8d',
  '#94a5a6',
  '#bdc3c7',
  '#ecf0f1',
  '#8e44ad',
  '#9b59b6',
  '#2980b9',
  '#3298db',
  '#c0392c',
  '#e74c3c',
  '#d35400',
  '#f39c11',
  '#f1c40e',
  '#17a085',
  '#27ae61',
  '#2ecc71',
]

export default function (mind: MindElixirInstance) {
  console.log('install node menu')
  function clearSelect(klass, remove) {
    const elems = mind.container.querySelectorAll(klass)
      ;[].forEach.call(elems, function (el) {
        el.classList.remove(remove)
      })
  }

  // create element
  const locale = i18n[mind.locale] ? mind.locale : 'en'
  const styleDiv = createDiv(
    'nm-style',
    `
  <div class="nm-fontsize-container">
    ${['15', '24', '32']
      .map((size) => {
        return `<div class="size"  data-size="${size}">
    <svg class="icon" style="width: ${size}px;height: ${size}px" aria-hidden="true">
      <use xlink:href="#icon-a"></use>
    </svg></div>`
      })
      .join('')}<div class="bold"><svg class="icon" aria-hidden="true">
<use xlink:href="#icon-B"></use>
</svg></div>
  </div>
  <div class="nm-fontcolor-container">
    ${colorList
      .map((color) => {
        return `<div class="split6"><div class="palette" data-color="${color}" style="background-color: ${color};"></div></div>`
      })
      .join('')}
  </div>
  <div class="bof">
  <span class="font">${i18n[locale].font}</span>
  <span class="background">${i18n[locale].background}</span>
  </div>`
  )
  const tagDiv = createDiv(
    'nm-tag',
    `${i18n[locale].tag}<input class="nm-tag" tabindex="-1" placeholder="${i18n[locale].tagsSeparate}" />`
  )
  const iconDiv = createDiv(
    'nm-icon',
    `${i18n[locale].icon}<input class="nm-icon" tabindex="-1" placeholder="${i18n[locale].iconsSeparate}" />`
  )
  const urlDiv = createDiv(
    'nm-url',
    `${i18n[locale].url}<input class="nm-url" tabindex="-1" />`
  )
  const imgDiv = createDiv(
    'nm-img',
    `${i18n[locale].img}<div class="img-container"></div><button class="link-btn">关联图片</button>`
  )
  const fileDiv = createDiv(
    'nm-file',
    `${i18n[locale].file}<div class="file-container"></div><button class="link-btn">关联文件</button>`
  )
  const memoDiv = createDiv(
    'nm-memo',
    `${i18n[locale].memo || 'Memo'}<textarea class="nm-memo" rows="4" tabindex="-1" />`
  )

  // create container
  const menuContainer = document.createElement('div')
  menuContainer.className = 'node-menu'
  menuContainer.innerHTML = `
  <div class="button-container"><svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-close"></use>
  </svg></div>
  `
  menuContainer.appendChild(styleDiv)
  menuContainer.appendChild(tagDiv)
  menuContainer.appendChild(iconDiv)
  menuContainer.appendChild(urlDiv)
  menuContainer.appendChild(imgDiv)
  menuContainer.appendChild(fileDiv)
  menuContainer.appendChild(memoDiv)
  menuContainer.hidden = true
  mind.container.append(menuContainer)

  // query input element
  const sizeSelector = menuContainer.querySelectorAll('.size')
  const bold: HTMLElement = menuContainer.querySelector('.bold')
  const buttonContainer: HTMLElement =
    menuContainer.querySelector('.button-container')
  const fontBtn: HTMLElement = menuContainer.querySelector('.font')
  const tagInput: HTMLInputElement = mind.container.querySelector('.nm-tag')
  const iconInput: HTMLInputElement = mind.container.querySelector('.nm-icon')
  const urlInput: HTMLInputElement = mind.container.querySelector('.nm-url')
  const imgContainer: HTMLElement = mind.container.querySelector('.img-container')
  const fileContainer: HTMLElement = mind.container.querySelector('.file-container')
  const memoInput: HTMLInputElement = mind.container.querySelector('.nm-memo')
  //图片或者文件的点击按钮
  const imgLinkBtn: HTMLElement = imgDiv.querySelector('.link-btn');
  const fileLinkBtn: HTMLElement = fileDiv.querySelector('.link-btn');
  // handle input and button click
  let bgOrFont
  const E = mind.findEle

  async function fetchMindFileImageList() {
    //获取后台的思维导图，文件和图片列表
    let headers = {};
  
    if (!mind.apiInterface.headerToken) {
      console.warn('Mind COREL No headerToken found in mind config');
    } else {
      headers = {
        'Authorization': `Bearer ${mind.apiInterface.headerToken}`,
      };
    }
  
    const listAPI: string = mind.apiInterface.listAPI;
    try {
      const response = await fetch(listAPI, {
        method: 'GET',
        headers: headers,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API response:', data);
  
      if (data.code === 0) {
        console.log(data.data)
        console.timeEnd('list');
      } else {
        alert(`Failed to fetch data from the API, ${data.msg}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(`Failed to fetch data from the API, ${mind.apiInterface.listAPI}`);
    }
  }
  

  async function toggleMenuContainer(type: 'image' | 'file') {
    // 切换图片列表或文件列表
    await fetchMindFileImageList()
    if (type === 'image') {
      // 显示图片列表
      console.log('Display image list for linking');
      // 示例：可以弹出一个图片列表供用户选择
    } else if (type === 'file') {
      // 显示文件列表
      console.log('Display file list for linking');
      // 示例：可以弹出一个文件列表供用户选择
    }
  }

  imgLinkBtn.onclick = async () => {
    await toggleMenuContainer('image');
  };

  fileLinkBtn.onclick = async () => {
    await toggleMenuContainer('file');
  };

  menuContainer.onclick = (e) => {
    if (!mind.currentNode) return
    const nodeObj = mind.currentNode.nodeObj
    const target = e.target as HTMLElement
    if (target.className === 'palette') {
      clearSelect('.palette', 'nmenu-selected')
      target.className = 'palette nmenu-selected'
      const color = target.dataset.color
      const patch = { style: {} as any }
      if (bgOrFont === 'font') {
        patch.style.color = color
      } else if (bgOrFont === 'background') {
        patch.style.background = color
      }
      console.log(patch)
      mind.reshapeNode(mind.currentNode, patch)
    } else if (target.className === 'background') {
      clearSelect('.palette', 'nmenu-selected')
      bgOrFont = 'background'
      target.className = 'background selected'
      target.previousElementSibling.className = 'font'
      if (nodeObj.style && nodeObj.style.background) {
        menuContainer.querySelector(
          '.palette[data-color="' + nodeObj.style.background + '"]'
        ).className = 'palette nmenu-selected'
      }
    } else if (target.className === 'font') {
      clearSelect('.palette', 'nmenu-selected')
      bgOrFont = 'font'
      target.className = 'font selected'
      target.nextElementSibling.className = 'background'
      if (nodeObj.style && nodeObj.style.color) {
        menuContainer.querySelector(
          '.palette[data-color="' + nodeObj.style.color + '"]'
        ).className = 'palette nmenu-selected'
      }
    }
  }
  Array.from(sizeSelector).map((dom) => {
    ; (dom as HTMLElement).onclick = (e) => {
      clearSelect('.size', 'size-selected')
      const size = e.currentTarget as HTMLElement
      size.className = 'size size-selected'
      mind.reshapeNode(mind.currentNode, {
        style: { fontSize: size.dataset.size },
      })
    }
  })
  bold.onclick = (e: MouseEvent & { currentTarget: Element }) => {
    let fontWeight = ''
    if (mind.currentNode.nodeObj?.style?.fontWeight === 'bold') {
      e.currentTarget.className = 'bold'
    } else {
      fontWeight = 'bold'
      e.currentTarget.className = 'bold size-selected'
    }
    mind.reshapeNode(mind.currentNode, { style: { fontWeight } })
  }
  tagInput.onchange = (e: InputEvent & { target: HTMLInputElement }) => {
    if (!mind.currentNode) return
    if (typeof e.target.value === 'string') {
      const newTags = e.target.value.split(',')
      mind.reshapeNode(mind.currentNode, { tags: newTags.filter((tag) => tag) })
    }
  }
  iconInput.onchange = (e: InputEvent & { target: HTMLInputElement }) => {
    if (!mind.currentNode) return
    if (typeof e.target.value === 'string') {
      const newIcons = e.target.value.split(',')
      mind.reshapeNode(mind.currentNode, {
        icons: newIcons.filter((icon) => icon),
      })
    }
  }
  urlInput.onchange = (e: InputEvent & { target: HTMLInputElement }) => {
    if (!mind.currentNode) return
    mind.reshapeNode(mind.currentNode, { hyperLink: e.target.value })
  }
  // 更新视图函数，用于重新渲染 imgContainer 和 fileContainer, 暂时不知道怎么用
  function updateView() {
    if (!mind.currentNode) return;
    const nodeObj = mind.currentNode.nodeObj;

    // 更新 imgContainer
    imgContainer.innerHTML = nodeObj.image
      ? `<span class="file-link" data-url="${nodeObj.image.url}">${nodeObj.image.name}</span> <button class="remove-btn">x</button>`
      : `<button class="upload-btn">Upload Image</button>`;

    // 更新 fileContainer
    fileContainer.innerHTML = nodeObj.file
      ? `<span class="file-link" data-url="${nodeObj.file.url}">${nodeObj.file.name}</span> <button class="remove-btn">x</button>`
      : `<button class="upload-btn">Upload File</button>`;
  }

  imgContainer.onclick = async (e) => {
    if (!mind.currentNode) return
    const nodeObj = mind.currentNode.nodeObj
    if (e.target.classList.contains('remove-btn')) {
      // Remove image
      mind.deleteFile(nodeObj.image.name)
      mind.reshapeNode(mind.currentNode, { image: null })
      imgContainer.innerHTML = `<button class="upload-btn">Upload Image</button>`
    } else if (e.target.classList.contains('file-link')) {
      // Open image in a new tab
      window.open(e.target.dataset.url, '_blank')
    } else {
      // Trigger file input for image upload
      await mind.upload() //调用上传方法
    }
  }
  fileContainer.onclick = async (e) => {
    if (!mind.currentNode) return
    const nodeObj = mind.currentNode.nodeObj
    if (e.target.classList.contains('remove-btn')) {
      // Remove file
      mind.deleteFile(nodeObj.file.name)
      mind.reshapeNode(mind.currentNode, { file: null })
      fileContainer.innerHTML = `<button class="upload-btn">Upload File</button>`
    } else if (e.target.classList.contains('file-link')) {
      // Open file in a new tab
      window.open(e.target.dataset.url, '_blank')
    } else {
      // Trigger file input for file upload
      await mind.upload() //调用上传方法
    }
  }
  memoInput.onchange = (e: InputEvent & { target: HTMLInputElement }) => {
    if (!mind.currentNode) return
    mind.currentNode.nodeObj.memo = e.target.value
    mind.bus.fire('operation', {
      name: 'updateMemo',
      obj: mind.currentNode.nodeObj,
    })
  }
  let state = 'open'
  buttonContainer.onclick = (e) => {
    menuContainer.classList.toggle('close')
    if (state === 'open') {
      state = 'close'
      buttonContainer.innerHTML = `<svg class="icon" aria-hidden="true"><use xlink:href="#icon-menu"></use></svg>`
    } else {
      state = 'open'
      buttonContainer.innerHTML = `<svg class="icon" aria-hidden="true"><use xlink:href="#icon-close"></use></svg>`
    }
  }

  // handle node selection
  mind.bus.addListener('unselectNode', function () {
    menuContainer.hidden = true
  })
  mind.bus.addListener('selectNode', function (nodeObj, clickEvent) {
    if (!clickEvent) return
    menuContainer.hidden = false
    clearSelect('.palette', 'nmenu-selected')
    clearSelect('.size', 'size-selected')
    clearSelect('.bold', 'size-selected')
    bgOrFont = 'font'
    fontBtn.className = 'font selected'
    fontBtn.nextElementSibling.className = 'background'
    if (nodeObj.style) {
      if (nodeObj.style.fontSize) {
        menuContainer.querySelector(
          '.size[data-size="' + nodeObj.style.fontSize + '"]'
        ).className = 'size size-selected'
      }
      if (nodeObj.style.fontWeight) {
        menuContainer.querySelector('.bold').className = 'bold size-selected'
      }
      if (nodeObj.style.color) {
        menuContainer.querySelector(
          '.palette[data-color="' + nodeObj.style.color + '"]'
        ).className = 'palette nmenu-selected'
      }
    }
    if (nodeObj.tags) {
      tagInput.value = nodeObj.tags.join(',')
    } else {
      tagInput.value = ''
    }
    if (nodeObj.icons) {
      iconInput.value = nodeObj.icons.join(',')
    } else {
      iconInput.value = ''
    }
    urlInput.value = nodeObj.hyperLink || ''
    imgContainer.innerHTML = nodeObj.image
      ? `<span class="file-link" data-url="${nodeObj.image.url}">${nodeObj.image.name}</span> <button class="remove-btn">x</button>`
      : `<button class="upload-btn">Upload Image</button>`
    fileContainer.innerHTML = nodeObj.file
      ? `<span class="file-link" data-url="${nodeObj.file.url}">${nodeObj.file.name}</span> <button class="remove-btn">x</button>`
      : `<button class="upload-btn">Upload File</button>`
    memoInput.value = nodeObj.memo || ''
  })
}
