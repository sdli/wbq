import React ,{Component } from "react";
import { Spin,Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,DatePicker} from 'antd';
import dataFetch from "../../utils/dataFetch";

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const RangePicker = DatePicker.RangePicker;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    loading: false
  };

  getStartTime(timeStamp){
      const start = new Date(timeStamp);
      const returnStamp = timeStamp - (start.getHours()*60*60+start.getMinutes()*60+start.getSeconds())*1000;
      return returnStamp; 
  }

  getEndTime(timeStamp){
      const end = new Date(timeStamp);
      const returnStamp = timeStamp + (24*60*60 - end.getHours()*60*60 - end.getMinutes()*60 - end.getSeconds())*1000;
      return returnStamp;
  }

  handleSubmit = function(dispatch){
    const that = this;
    return  function(e){
        e.preventDefault();
        that.props.form.validateFieldsAndScroll((err, values) => {
          const initValues={
            shopname: values['shopname'],
            type: values["type"],
            startTime: that.getStartTime(Date.parse(values["timePicker"][0]["_d"])),
            endTime: that.getEndTime(Date.parse(values["timePicker"][1]["_d"]))
          };
          console.log(initValues);
          if (!err) {
              dispatch({type:"fetch/getExcel",values:initValues})
          }
        });
      }
  }

  handleChange(value) {
  }

  checkDate = (rule, value, callback) => {
      var timestamp1 = (typeof value !== "undefined")?Date.parse(value[0]["_d"]):null;
      var timestamp2 = (typeof value !== "undefined")?Date.parse(value[1]["_d"]):null;
      if(timestamp1 == null || timestamp2 == null){
        callback("请选择起始时间！");
      }else if((timestamp2-timestamp1)/1000 > 60*60*24*31){
        callback('起始时间和终止时间不超过1个月！');
      }else{
        callback();
      }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;
    const {dispatch,src,loading,shops} = this.props;
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

    const sheets=[{name:"商品查询",code:"1"},{name:"交易订单",code:"2"},{name:"收银台账单",code:"3"}];
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '请选择时间' },{validator:this.checkDate}],
    };

    return (
      <Spin spinning={loading} tip="加载中..." >
        <Form onSubmit={this.handleSubmit(dispatch)}>
          <FormItem
            {...formItemLayout}
            label="店铺名称"
            hasFeedback
          >
            {getFieldDecorator('shopname', {
              rules: [{
                required: true, message: '请选择店铺名称',
              }],
              initialValue: (typeof shops[0] != "undefined")?shops[0].storesId:null
            })(
              <Select style={{ width: 120 }} onChange={this.handleChange}>
                  {shops && shops.map((val,index)=>{
                      return(
                          <Option key={index} value={val.storesId}>{val.storesName}</Option>
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
              <RangePicker format="YYYY-MM-DD" style={{textAlign:"left"}} />
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" size="large">下载表单</Button>
          </FormItem>
          <iframe ref={(file)=>{this.file=file}} src={src} style={{display:"none"}}></iframe>
        </Form>
      </Spin>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default WrappedRegistrationForm;