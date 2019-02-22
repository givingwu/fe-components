import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, InputNumber, Input, Select, Spin, Form, Row, Col } from 'antd';
import styles from './index.less';


const FormItem = Form.Item;
const Option = Select.Option;
const getItem = (type) => type === 'number'
  ? (props) => (<InputNumber {...props} />)
  : type === 'select'
    ? (props) => (
      <Select
        showSearch
        placeholder="请选择"
        style={{ width: '100%' }}
        notFoundContent={props.loading ? <Spin size="small" /> : null}
        { ...props }
      >
        {
          props.options.map(t => <Option key={t.value} value={t.value}>{t.label}</Option>)
        }
      </Select>
    )
    : (props) => <Input {...props} />

@Form.create()
export default class HeaderForm extends PureComponent {
  static propTypes = {
    firstType: PropTypes.oneOf(['input', 'number', 'select']),
    firstKey: PropTypes.string.isRequired,
    firstLabel: PropTypes.string,
    firstOption: PropTypes.object,
    secondType: PropTypes.oneOf(['input', 'number', 'select']),
    secondLabel: PropTypes.string,
    secondKey: PropTypes.string,
    secondOption: PropTypes.object,
    callback: PropTypes.func.isRequired,
    selectOptions: PropTypes.array
  }

  static defaultProps = {
    firstType: 'input',
    firstLabel: '',
    firstOption: {},
    secondLabel: '',
    secondOption: {},
    selectOptions: [],
  };

  componentDidMount() {
    const { getRef } = this.props;

    getRef && getRef(this)
  }

  handleSubmit = (e) => {
    e && e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.callback(values);
      }
    });
  }

  // 重置事件
  handleFormReset = (needSubmit = true) => {
    this.props.form.resetFields();

    needSubmit && this.handleSubmit();
  }

  render() {
    const { firstType, firstProps, firstLabel, firstKey, firstOption, secondKey, secondType, secondProps, secondLabel, secondOption, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.HeaderForm}>
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label={firstLabel}>
                {getFieldDecorator(firstKey, { ...firstOption })(
                    // FirstItem[firstType]()
                    getItem(firstType)(firstProps)
                 )}
              </FormItem>
            </Col>
            {
              secondKey && <Col md={8} sm={24}>
                <FormItem label={secondLabel}>
                  {getFieldDecorator(secondKey, { ...secondOption })(
                    getItem(secondType)(secondProps)
                  )}
                </FormItem>
              </Col>
            }
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
