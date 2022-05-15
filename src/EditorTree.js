import React, { useState, useEffect } from 'react';
import { Input,Menu, Tree,Dropdown } from 'antd';
import { PlusOutlined, CloseOutlined,CloseCircleOutlined, CheckCircleOutlined,MoreOutlined} from '@ant-design/icons';
import styles from './EditableTree.less';
import _ from 'lodash'


const { TreeNode } = Tree;
var tempKey = '1000';

const EditorTree = () => {
  var treeDataTemp = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            {
              title: '0-0-0-0',
              key: '0-0-0-0'
            },
            {
              title: '0-0-0-1',
              key: '0-0-0-1'
            }
          ]
        },
        {
          title: '0-0-2',
          key: '0-0-2'
        }
      ]
    },
    {
      title: '0-2',
      key: '0-2'
    }
  ];
  const [treeData, setTreeData] = useState(treeDataTemp);
  const menu =(item)=> {
      return(
        <Menu
        items={[
          {
            label: (
              <a onClick={() => onDelete(item.key)}>
                删除
              </a>
            ),
          },
          {
            label: (
                <a onClick={() => onAdd(item.key)}>
                添加
                </a>
            ),
          },
          {
            label: (
              <a onClick={() => onEdit(item.key)}>
                编辑
              </a>
            ),
          },
        ]}
      />
      )
  }
   
  
  useEffect(() => {
    funtotree(treeData)
  }, [])
  const funtotree = (data) =>{
    for(let i in data){
      data[i].value= data[i].key
      data[i].defaultValue = data[i].key
      data[i].isEditable= false
      if(data[i].children){
        funtotree(data[i].children);
      }
    }
    setTreeData([...data])
  }

  const onDragEnter = (info) => {
    console.log(info);
  };

  const onDrop = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setTreeData([...data]);
  };
  const addNode = (key, data) =>{
    data.forEach((item) => {
      if (item.key === key) {
        item.children
          ? item.children.push({
              title: '默认值',
              value:'默认值',
              defaultValue:'默认值',
              isEditable:false,
              key: `${tempKey++}`
            })
          : (item.children = [
              {
                title: '默认值',
                value:'默认值',
                defaultValue:'默认值',
                isEditable:false,
                key: `${tempKey++}`
              }
            ]);
      } else {
        if (item.children) {
          addNode(key, item.children);
        }
      }
    });
    return data;
  }
  const onAdd = (key) => {
    const treeDataOld = _.cloneDeep(treeData)
   const treeDataNew =  addNode(key, treeDataOld);
    setTreeData([...treeDataNew]);
  };
  const deleteNode = (key, arr) =>{
    arr.map((item, index) => {
      if (item.key == key) {
        arr.splice(index, 1);
      }
      if (item.children) {
        deleteNode(key, item.children);
      }
    });
    return arr;
  }
  const onDelete = (key) => {
    const treeDataOld = _.cloneDeep(treeData)
    const treeDataNew = deleteNode(key, treeDataOld);
    setTreeData(treeDataNew);
  };

  const onChange = (e, key) => {
    const treeDataOld = _.cloneDeep(treeData)
    const treeDataNew = editNode(key, treeDataOld, e.target.value);
    setTreeData(treeDataNew);

    function editNode(key, data, val) {
      data.forEach((item) => {
        if (item.key === key) {
          item.value = val;
        } else {
          if (item.children) {
            editNode(key, item.children, val);
          }
        }
      });
      return data;
    }
  };
  const closeNode = (key, defaultValue, data) => {
    data.forEach((item) => {
        item.isEditable = false;
        if (item.key === key) {
          item.value = defaultValue;
        }
        if (item.children) {
          closeNode(key, defaultValue, item.children)
        }
      })
      return data
  }
  const onClose = (key, defaultValue) => {
    console.log('close');
   const newtreedata = closeNode(key, defaultValue, treeData);
   setTreeData([...newtreedata])
  }
  const saveNode = (key, data) => {
       data.forEach((item) => {
        if (item.key === key) {
          item.defaultValue = item.value;
        }
        if (item.children) {
          saveNode(key, item.children)
        }
        item.isEditable = false;
      })
      return data
  }

  const onSave = (key) => {
    console.log('save')
   const newtreedata =  saveNode(key, treeData);
   setTreeData([...newtreedata])
  }
  const renderTreeNodes = (data) => {
    // console.log('renderTreeNodes', data);
    return data.map((item) => {
        if (item?.isEditable) {
            item.title = (
                <div>
                    <input
                        className={styles.inputField}
                        value={item.value}
                        onChange={(e) => onChange(e, item.key)} />
                    <CloseCircleOutlined  style={{ marginLeft: 10 }} onClick={() => onClose(item.key, item.defaultValue)} />
                    <CheckCircleOutlined   style={{ marginLeft: 10 }} onClick={() => onSave(item.key)} />
                </div>
            );
        } else {
                item.title = (
                    <div className={styles.titleContainer}>
                        <span>
                            {item.value}
                        </span>
                        <span className={styles.operationField} >
                        <Dropdown overlay={menu(item)} trigger={['click']} placement="bottomLeft" arrow>
                         <MoreOutlined style={{ marginLeft: 10 }}  />
                        </Dropdown>
                        </span>
                    </div>
                )
        }

        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} >
                    {renderTreeNodes(item.children)}
                </TreeNode>
            );
        }

        return <TreeNode {...item} />;
    });
  };
 const onEdit = (key) => {
    console.log('edit');
   const newtreedata = editNode(key, treeData);
   setTreeData([...newtreedata])
  }
const editNode = (key, data) =>{
    data.forEach((item)=>{
        if (item.key === key) {
            item.isEditable = true;
          } else {
            item.isEditable = false;
          }
          //Tip: Must have, when a node is editable, and you click a button to make other node editable, the node which you don't save yet will be not editable, and its value should be defaultValue 
          item.value = item.defaultValue; // 当某节点处于编辑状态，并改变数据，点击编辑其他节点时，此节点变成不可编辑状态，value 需要回退到 defaultvalue
          if (item.children) {
            editNode(key, item.children)
          }
    })
    return data
}
  const onTitleRender = (item) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input
          // value={item.title}
          defaultValue={item.title}
          onChange={(e) => onChange(e, item.key)}
        />
        <span style={{ display: 'flex' }}>
          <PlusOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(item.key)} />
          <CloseOutlined style={{ marginLeft: 10 }} onClick={() => onDelete(item.key)} />
        </span>
      </div>
    );
  };

  return (
    <>
  
        <Tree
          className="draggable-tree"
          defaultExpandAll={true}
          draggable
          onDragEnter={onDragEnter}
          onDrop={onDrop}
        >
          {treeData?.length && renderTreeNodes(treeData)}
        </Tree>
      
    </>
  );
};

export default EditorTree;


