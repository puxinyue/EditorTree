import React, {Component} from 'react';
import {Tree} from 'antd';
import styles from './EditableTree.less';
import { EditOutlined,MoreOutlined,CheckCircleOutlined,CloseCircleOutlined} from '@ant-design/icons';
const {TreeNode} = Tree;

class App extends Component {

 data = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0'},
          { title: '0-0-0-1', key: '0-0-0-1'},
          { title: '0-0-0-2', key: '0-0-0-2'},
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
]
  expandedKeys = [];

  state = {
    expandedKeys: [],
    data: this.data
  };

  componentDidMount() {
    this.onExpand([]); // 手动触发，否则会遇到第一次添加子节点不展开的Bug
    this.funtotree(this.data)
  }
  funtotree = (data) =>{
    for(var i in data){
      data[i].value= data[i].key
      data[i].defaultValue = data[i].key
      data[i].isEditable= false
      console.log(data)
      if(data[i].children){
        this.funtotree(data[i].children);
      }
    }
  }
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    this.expandedKeys = expandedKeys;
    this.setState({ expandedKeys: expandedKeys })
  }

  renderTreeNodes = data => data.map((item) => {
        if (item.isEditable) {
            item.title = (
                <div>
                    <input
                        className={styles.inputField}
                        value={item.value}
                        onChange={(e) => this.onChange(e, item.key)} />
                    <CloseCircleOutlined  style={{ marginLeft: 10 }} onClick={() => this.onClose(item.key, item.defaultValue)} />
                    <CheckCircleOutlined   style={{ marginLeft: 10 }} onClick={() => this.onSave(item.key)} />
                </div>
            );
        } else {
            item.title = (
                <div className={styles.titleContainer}>
                    <span>
                        {item.value}
                    </span>
                    <span className={styles.operationField} >
                     <EditOutlined style={{ marginLeft: 10 }} type='edit' onClick={() => this.onEdit(item.key)} />
                    </span>
                </div>
            )
          
          
        }

        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }

        return <TreeNode {...item} />;
    })


  onEdit = (key) => {
    console.log('edit');
    this.editNode(key, this.data);
    this.setState({
      data: this.data
    });
  }

  editNode = (key, data) => data.map((item) => {
    if (item.key === key) {
      item.isEditable = true;
    } else {
      item.isEditable = false;
    }
    //Tip: Must have, when a node is editable, and you click a button to make other node editable, the node which you don't save yet will be not editable, and its value should be defaultValue 
    item.value = item.defaultValue; // 当某节点处于编辑状态，并改变数据，点击编辑其他节点时，此节点变成不可编辑状态，value 需要回退到 defaultvalue
    if (item.children) {
      this.editNode(key, item.children)
    }
  })

  onClose = (key, defaultValue) => {
    console.log('close');
    this.closeNode(key, defaultValue, this.data);
    this.setState({
      data: this.data
    });
  }

  closeNode = (key, defaultValue, data) => data.map((item) => {
    item.isEditable = false;
    if (item.key === key) {
      item.value = defaultValue;
    }
    if (item.children) {
      this.closeNode(key, defaultValue, item.children)
    }
  })

  onSave = (key) => {
    console.log('save')
    this.saveNode(key, this.data);
    this.setState({
      data: this.data
    });
  }

  saveNode = (key, data) => data.map((item) => {
    if (item.key === key) {
      item.defaultValue = item.value;
    }
    if (item.children) {
      this.saveNode(key, item.children)
    }
    item.isEditable = false;
  })

  onChange = (e, key) => {
    console.log('onchange')
    this.changeNode(key, e.target.value, this.data);
    this.setState({
      data: this.data
    });
  }

  changeNode = (key, value, data) => data.map((item) => {
    if (item.key === key) {
      item.value = value;
    }
    if (item.children) {
      this.changeNode(key, value, item.children)
    }
  })

  render() {
    return (
      <div>
        <Tree expandedKeys={this.state.expandedKeys} selectedKeys={[]} onExpand={this.onExpand}>
          {this.renderTreeNodes(this.state.data)}
        </Tree>
      </div>
    )
  }
}

export default App;
