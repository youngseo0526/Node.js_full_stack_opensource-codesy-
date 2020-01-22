FlowRouter.template('/home_posting/:_id', 'home_posting');


Template.home_posting.onRendered(function() {
  $('#editor').summernote({
    popover: {},
    minHeight: 200,
    maximumImageFileSize: 1048576*10
  });
});

Template.home_posting.helpers({
  post: function() {
    var _id = FlowRouter.getParam('_id');
    if(_id === 'newPosting') {
      return {};    //새글 작성일때는 화면에 비어있는 데이터를 제공.
    }

    Meteor.setTimeout(function() { //화면 에디터에 편집 모드를 초기화 하기 위한 트릭
      $('#editor').summernote('reset')
    });

    return DB_POSTS.findOne({_id: _id});
  },
  link: function() {
    // 저장 된 이미지 링크를 반환
    return DB_FILES.findOne({_id: this.file_id}).link();
  }
});

Template.home_posting.events({
  'click #btn-save': function(evt,inst) {
    var file = $('#inp-file').prop('files')[0];   // 화면에서 선택 된 파일 가져오기
    var file_id = DB_FILES.insertFile(file);
    var name = $('#inp-name').val();
    var title = $('#inp-title').val();
    var html = $('#editor').summernote('code');

    if(!title) {
      return alert('제목은 반드시 입력 해 주세요.');
    }
    var _id = FlowRouter.getParam('_id');
    if( _id === 'newPosting') { //첫 글
      DB_POSTS.insert({
        createdAt: new Date(),
        name: name,
        title: title,
        content: html,
        readCount: 0,
        file_id: file_id
      })
    } else {
      var post = DB_POSTS.findOne({_id: _id}); //수정
      post.name = name;
      post.title = title;
      post.content = html;
      post.file_id= file_id;
      DB_POSTS.update({_id: _id}, post);
    }

    alert('저장하였습니다.');
    $('#inp-file').val('');
    $('#inp-name').val('');
    $('#inp-title').val('');
    $('#editor').summernote('reset');
    window.history.back();
  },
})