import React ,{Component } from "react";
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const RangePicker = DatePicker.RangePicker;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        alert('接收到数据：' + JSON.stringify(values));
        this.file.src="http://localhost:8000/api/file";
      }
    });
  }

    handleChange(value) {
        console.log(`selected ${value}`);
    }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    const shops=[{name:"温碧泉1店",code:"skdjfisejf"},{name:"温碧泉2店",code:"235j293u5u"},{name:"温碧泉3店",code:"1234j239rj"}];
    const sheets=[{name:"商品查询",code:"1"},{name:"交易订单",code:"2"},{name:"销售员",code:"3"}];
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '请选择时间',format:"YYYY-MM-DD HH:mm:ss" }],
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="店铺名称"
          hasFeedback
        >
          {getFieldDecorator('shopname', {
            rules: [{
              required: true, message: '请选择店铺名称',
            }],
            initialValue: "skdjfisejf"
          })(
            <Select style={{ width: 120 }} onChange={this.handleChange}>
                {shops.map((val,index)=>{
                    return(
                        <Option key={index} value={val.code}>{val.name}</Option>
                    );
                })}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={(
            <span>
              表单类型
            </span>
          )}
          hasFeedback
        >
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择表单类型', whitespace: true }],
            initialValue: "1"
          })(
            <Select style={{ width: 120 }} onChange={this.handleChange}>
                {sheets.map((val,index)=>{
                    return(
                        <Option key={index} value={val.code}>{val.name}</Option>
                    );
                })}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              起始时间
            </span>
          )}
          hasFeedback
        >
          {getFieldDecorator('timePicker', rangeConfig)(
            <RangePicker />
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">下载表单</Button>
        </FormItem>
        <iframe ref={(file)=>{this.file=file}} style={{display:"none"}}></iframe>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default WrappedRegistrationForm;