import { Spin,Alert } from 'antd';

const loading = function({tip}){
    return (
        <div style={{width:"100%",padding:"10% 20%"}}>
            <Alert
                message="暂未绑定门店"
                description="出现此提示，说明您的店铺没有数据或未绑定店铺，请及时联系云东家客服绑定门店。"
                type="error"
                showIcon
            />
        </div>
    );
};

export default loading;
