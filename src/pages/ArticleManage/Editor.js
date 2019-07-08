import React, { Fragment,PureComponent, Children } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Icon, Card,Tag , Input,Form,message } from 'antd';
import { connect } from 'dva';
import Editor from 'for-editor'
import Result from '@/components/Result';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const { CheckableTag  } = Tag;

@connect(({ article, loading }) => ({
  article,
  loading: loading.models.article,
}))

@Form.create()
class EditorUpdate extends PureComponent{
  constructor(){
    super()
    this.state={
      tagsFromServer:['JavaScript', 'HTML', 'CSS', 'Node','Vue','Reactjs','webpack'],
      keyword:[],
      title:"",
      inputVisible:false,
      inputValue:"",
      content:"",
      article:null,
    }
  }
  componentDidMount(){
    const article = sessionStorage.getItem('article')
    if(article){
      const data = JSON.parse(article);
      this.setState({
        article:data,
        keyword:data.keyword.split(","),
        title:data.title,
        content:data.content
      })
      sessionStorage.removeItem('article')

    }
  }
  /*
  ** markdown （保存）
  */
  handleChange(value){
    this.setState({
      content:value
    })
  }
  handleSave = (value)=>{
    console.log(value)
  }

  /*
  ** 添加Tags
  **  handleInputChange,handleInputConfirm
  ** 选中Tags
  ** handleSelectChange
   */
  handleSelectChange = (tag, checked)=>{
    const { keyword } = this.state;
    const nextSelectedTags = checked ? [...keyword, tag] : keyword.filter(t => t !== tag);
    this.setState({ keyword: nextSelectedTags });
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tagsFromServer } = this.state;
    if (inputValue && tagsFromServer.indexOf(inputValue) === -1) {
      tagsFromServer = [...tagsFromServer, inputValue];
    }
    console.log(tagsFromServer);

    this.setState({
      tagsFromServer,
      inputVisible: false,
      inputValue: '',
    });
  };
  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };
  saveInputRef = input => (this.input = input);
  /* 最后提交 文章 */
  handleSubmit =()=>{
    const {form,dispatch} = this.props;
    const {keyword,content,article} = this.state
    form.validateFields((err, values)=>{
      if(!err){
        const id = article?article.id:null;
        const data = {
          keyword,
          content,
          title:values.title,
          id
        }

        if(id !== null){
          dispatch({
            type: 'article/fetchUpdate',
            payload: data,
            callback:(res)=>{
              if(res.code == 200){
                message.success(res.msg);
              }else{
                message.error(res.msg);
              }
            }
          });
        }else{
          dispatch({
            type: 'article/fetchInsert',
            payload: data,
            callback:(res)=>{
              if(res.code == 200){
                message.success(res.msg);
              }else{
                message.error(res.msg);
              }
            }
          });
        }

      }

    })
  }
  render(){
    const {content,keyword,tagsFromServer,inputVisible,inputValue,title} = this.state
    const { getFieldDecorator } = this.props.form;
    return(
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form labelCol={{ span: 2 }} wrapperCol={{ span: 12 }}>
            <Form.Item label="文章标题">
              {getFieldDecorator('title',{
                initialValue:title,
                rules: [{ required: true, message: '请填写标题！' }],
              })(
                <Input placeholder="请填写：文章标题" allowClear autoComplete="off"></Input>
              )}
            </Form.Item>
            <Form.Item label="文章关键词">
                {tagsFromServer.map(tag => (
                  <CheckableTag
                    key={tag}
                    checked={keyword.indexOf(tag) > -1}
                    onChange={checked => this.handleSelectChange(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}

                {inputVisible && (
                  <Input
                    ref={this.saveInputRef}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputConfirm}
                    onPressEnter={this.handleInputConfirm}
                  />
                )}
                {!inputVisible && (
                  <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                    <Icon type="plus" /> 新增关键词
                  </Tag>
                )}
            </Form.Item>
          </Form>
          <Editor value={content} height={550} onChange={this.handleChange.bind(this)} onSave={this.handleSave} style={{marginBottom:"20px"}}/>
          <Button type="primary" onClick={this.handleSubmit}>
            确定
          </Button>
        </Card>
      </PageHeaderWrapper>
    )
  }

}
export default EditorUpdate
