<?php
/*******************************************************************************
 * 上传文件接收存储demo
 *
 * @Author zengchao
 * @Email zengchao@sefonsoft.com
 * @UpdateTime (2016-06-27)
 *******************************************************************************/
	$targetFolder = '/uploadss'; //定义文档目录

	if (!file_exists($_SERVER['DOCUMENT_ROOT'] . $targetFolder )) {  //判断目录是否存在,目录不存在，则在根目录中创建目录
		mkdir($_SERVER['DOCUMENT_ROOT'] . $targetFolder);  //
	}

	$filename = $_FILES['file']['name']; //获取文件名称。
	$uploadFolder = $_SERVER['DOCUMENT_ROOT'] . $targetFolder . "/";
	if ($filename) {
		$moveFile = move_uploaded_file($_FILES["file"]["tmp_name"],$uploadFolder . iconv("UTF-8","gb2312",$filename)); //将文件从系统临时目录中移动到uploads目录
		if($moveFile){
			echo "文件上传成功！";
		}else{
			echo "文件上传失败！";
		}
	}
?>