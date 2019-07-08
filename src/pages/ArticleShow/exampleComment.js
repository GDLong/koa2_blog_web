import React, { PureComponent } from 'react';
import { Avatar,Comment} from 'antd';
import moment from 'moment';

class ExampleComment extends PureComponent {
  render() {
    const {children,data,handleReply} = this.props
    return (
      <Comment
        actions={[<span onClick={()=>handleReply(data)}>回复</span>]}
        author={<a href="javascript:void(0)">小火 </a>}
        avatar={
          <Avatar
            src="http://ptl2vhr8q.bkt.clouddn.com/gdldog.jpg"
            alt="Han Solo"
          />
        }
        content={<p>{data.content}</p>}
        datetime={moment(data.createdAt).fromNow()}
      >
        {children}
      </Comment>
    )
  }
}

export default ExampleComment;
