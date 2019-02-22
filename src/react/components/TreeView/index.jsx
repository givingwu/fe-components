import React, { Component } from 'react';
import { Tree, Spin } from 'antd';

const TreeNode = Tree.TreeNode;

/**
 * The 1st Customized Form Item Component, Good Job!
 * I have known how to create own Controlled component.
 */
export default class TreeView extends Component {
  static defaultProps = {
    className: 'tree-view',
    style: { height: 400, overflowY: 'auto' },
    treeData: [],
    treeProps: {},
    noData: '暂无数据',
    treeNodeProps: { selectable: false },
    filter: item => (item),
  }

  state = {
    value: []
  }

  componentDidMount() {
    this.setState({
      value: this.props.value || [],
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value }, () => console.log(value));
    }
  }

  onChange = (value) => {
    this.setState({
      value,
    }, () => {
      this.props.onChange(value);
    });
  }

  renderTreeNodes = (data) => {
    const { treeNodeProps, filter } = this.props;
    const geneItemProps = item => ({
      ...item,
      ...treeNodeProps,
      dataRef: item,
      disableCheckbox: !item.key,
    });

    return data.map((item) => {
      if (item.children) {
        return (
          filter(item)
          && (
            <TreeNode {...geneItemProps(item)}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          )
        );
      }

      return (
        filter(item) && <TreeNode {...geneItemProps(item)} />
      );
    });
  }

  render() {
    const { value } = this.state;
    const { loading = true, handleSelect, loadingTxt = '', noData, treeData, treeProps, style, className } = this.props;

    return (
      <Spin spinning={loading} tip={loadingTxt}>
        <div className={className} style={style}>
          {
            treeData && treeData.length
            ? (
              <Tree
                onSelect={handleSelect}
                defaultExpandAll
                checkedKeys={value}
                onCheck={this.onChange}
                {...treeProps}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            )
            : <span>{noData}</span>
          }
        </div>
      </Spin>
    );
  }
}
