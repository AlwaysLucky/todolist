;(function(){
	'use strict';

	var $task_add = $(".task-add"),
		$task_button = $(".task-add button"),
		$task_detail_mask = $('.task-detail-mask'),
		audio = document.querySelector('audio'),
		$task_item,
		$checkbox_complete,
		$task_detail,
		new_task = {},
		$delete_task_trigger,
		$detail_task_trigger,
		task_list = [];
	init(); // 初始化函数 入口

	$task_button.on('click',function(e){
		e.preventDefault();
		var new_task = {};
		new_task.content =  $task_add.find('input[name=content]').val();
		if(!new_task.content) return ;

		task_list.push(new_task);
		reload_list();
		$task_add.find('input[name=content]').val(null);
	})

	function init(){
		task_list = store.get('task_list') || [];
		if (task_list.length) {
			renderList(task_list);
		}
		task_remind_check();
	}
	function renderList(task_list){
		var $task_list = $('.task-list');
		$task_list.empty();
		var complete_item = [];
		for (var i = task_list.length - 1; i >= 0; i--) {
			var _item = task_list[i];
			if(_item && _item.complete)
				complete_item[i] = _item;
			else
				var item = render_task_item(task_list[i],i)
				$task_list.append(item);
		};
		complete_item.forEach(function(e,index){
			item = render_task_item(e,index);
			$task_list.append(item);
		})		

		$delete_task_trigger = $('.action.delete');
		$detail_task_trigger = $('.action.detail');
		$task_item = $('.task-item');
		$checkbox_complete = $('.task-item .complete[type=checkbox]');
		delete_task_item();
		detail_task_item();
		listen_checkbox_complete();
	}

	function render_task_item(data,i){
		if (!data || (!i && i !==0)) {return}
		var complete = data.complete?'checked':'';

		var html = '<div class="task-item" data-id='+i+' >'
				+	'<span><input type="checkbox" class=complete '+complete+'></span>'
				+	'<span class=content>'+data.content+'</span>'
				+	'<div>'
				+	'<span><button class=\'action delete\'>删除</button></span>'
				+	'<span><button class=\'action detail\'>详情</button></span>'
				+	'</div>'
				+ '</div>';
		return $(html);
	}

	function render_task_mask(index){
		$('.task-detail-mask').css('display','block');
		var data = task_list[index];
		var html = '<div class=task-detail>'
				+  '<div class=content>'
				+		'<h3 contenteditable=false>'+(data.content || '')+'</h3>'
				+	'</div>'
				+  '<div>'
				+	'<div class=descption>'
				+		'<textarea name= id=>'+(data.desc || '')+'</textarea>'
				+	'</div>'
				+	'</div>'
				+	'<div class=remaind>'
				+		'<input class=datetime type=text value="'+(data.date || '')+'"><button class=submit>提交</button>'
				+	'</div>'
				+	'</div>';
		$task_detail_mask.html(html);
		$task_detail = $('.task-detail');
		$('.datetime').datetimepicker();
		$task_detail.on('click',function(e){
			e.stopPropagation();
			var target = e.target;
			if (target.tagName === 'BUTTON') {
				var data_detail = {};
				var data_seconds;
				data_detail.content = this.querySelector('.content').querySelector('h3').textContent;
				data_detail.desc = this.querySelector('.descption').querySelector('textarea').value;
				data_detail.date = this.querySelector('.remaind').querySelector('input').value;
				data_seconds = new Date(data_detail.date).getTime();
				if (data_detail.date.trim() !== '' && (Date.now() - data_seconds >1) ){
					alert('设置时间小于当前时间,请重新设置'); return;
				}
				update_task_mask(index,data_detail);
				this.parentNode.click();
			}
		})
		$task_detail.find('h3').on('dblclick',function(e){
			this.setAttribute('contenteditable',true); //标题可编辑状态
		})
	}

	function update_task_mask(index,data){
		if (index === undefined || !task_list[index]) return ;
		task_list[index] = $.extend({},task_list[index],data); // task_list[index] = data;
		reload_list();
	}

	function reload_list(){
		store.set('task_list',task_list);
		renderList(task_list);
	}

	function delete_task_item(){
		$delete_task_trigger.on('click',function(){
			var index = $(this).parent().parent().parent().attr('data-id');
			if (index === undefined || !task_list[index]) return;
			var tmp = confirm('确定删除吗?');
			// tmp ? delete task_list[index] : null; /*delete 并不会真正的删除*/
			tmp ? task_list.splice(index,1) : null;
			reload_list();
		})
	}

	function detail_task_item(){
		$detail_task_trigger.on('click',function(){
			var index = $(this).parent().parent().parent().attr('data-id');
			if (index === undefined || !task_list[index]) return;
			render_task_mask(index);
		})
	}

	function listen_checkbox_complete(){
		$checkbox_complete.on('click',function(){
			var index = $(this).parent().parent().attr('data-id');
			var is_complete = this.checked;
			update_task_mask(index,{complete: is_complete});
		})
	}

	function task_remind_check(){
		var currentTimestmp ;
		var timer = setInterval(function(){
			for (var i = task_list.length - 1; i >= 0; i--) {
				if(task_list[i].infromed) continue;
				currentTimestmp = new Date().getTime();
				var itemTimestmp = new Date(task_list[i].date).getTime();
				if(currentTimestmp - itemTimestmp >=1){
					update_task_mask(i,{infromed: true});
					notify();
				}
			}
		},500)
	}

	function notify(){
		render_mind_task();
		audio.play();
	}
	function render_mind_task(){
		var html = '<div class=task-mind-mask>'
				 +		'<span>有任务?</span><button>确定</button>'
				 +	'</div>' ;
		$('body').prepend(html);
		var btn = document.querySelector('.task-mind-mask button');
		btn.onclick = function(){
			document.body.removeChild(btn.parentNode);
			audio.pause();
		}		 
	}

	$task_detail_mask.on('click',function(event){
		 event.stopPropagation();
		$(this).css('display','none');
	})

	$task_item.on('dblclick',function(){
		event.stopPropagation();
		var index = this.getAttribute('data-id');
		render_task_mask(index);
	})
	
})();