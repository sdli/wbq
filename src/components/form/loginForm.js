import { Form, Icon, Input, Button, Checkbox, Alert } from 'antd';
import styles from './loginForm.css';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
    constructor(props){
        super(props);
    }

    submit = (dispatchFunc) => {
        return (e)=>{
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
            if (!err) {
                    dispatchFunc(values);         
                }
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {handleSubmit,alert,dispatch,netFail} = this.props;
        console.log(alert);
        return (
            <div>
                <h1 className={styles.center}>温碧泉报表中心</h1>
                <div className={styles.loginPosition}>
                    <Form onSubmit={this.submit(handleSubmit)} className={styles.loginForm}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="账户" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                        <a className={styles.loginFormForgot}  href="">忘记密码</a>
                        <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
                            登录
                        </Button>
                        （没有账户）： <a href="tel:0755-86524857">请联系云东家客服：0755-86524857!</a>
                        </FormItem>
                    </Form>
                    <Alert message="用户名或密码不正确" type="error" showIcon style={{display:alert}} />
                    <Alert message="服务器连接错误，请稍后重试！" type="error" showIcon style={{display:netFail?"block":"none"}} />
                </div>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create({
    
    //如果用户开始修改登录信息，则删除提示。
    onFieldsChange: (props,field)=>{
        if(props.alert === "block"){
            props.dispatch({type:"login/loginWaiting"});
        }
    }

})(NormalLoginForm);

export default WrappedNormalLoginForm;