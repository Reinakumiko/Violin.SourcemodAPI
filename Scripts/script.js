
$(document)
.ready(function () {
	$("a").click(function () {
		return BindFunction($(this));
	});

	$('.functionName, .glyphicon').popover(
	{
		container: 'body',
		placement: 'right',
		trigger: 'hover'
	});

	window.onresize = CheckSwipe;
	CheckSwipe(); 

	$("body").swipe({
		swipeRight: function () {
			if ($(".divLeftSlider").hasClass("divLeftSlider-Show"))
				return;
			FunctionListMenu(true);
		},
		swipeLeft: function () {
			if ($(".divLeftSlider").hasClass("divLeftSlider-Show")) {
				FunctionListMenu(false);
			}
		}
	});

	$(document).swipe({
		tap: function (event, target) {
			console.log(target);

			if ($(target).hasClass("divLeftSlider"))
				return;

			if ($(target).parents(".divLeftSlider").length > 0)
				return;

			FunctionListMenu(false);
		}
	});

	var loadingStatus = 0;
	$("#btnRemoveSearch").click(function () {
		if (loadingStatus == 1) {
			loadingStatus = 0;
			NProgress.done();
			$("#searchName").removeAttr("disabled");
		}

		$("#functionFileList").show();
		$("#functionFileList_Search").hide();

		$(this).css("display", "none");
		$("#searchName").val("");
	});

	$("#searchFunction").submit(function (event) {
		loadingStatus++;
		NProgress.start();
		$("#searchName").attr("disabled", true);
		$("#btnRemoveSearch").show();

		$.ajax({
			url: "/Search",
			data: {
				search: $("#searchName").val()
			},
			dataType: "html",
			success: function (data) {
				if (loadingStatus < 1)
					return;

				loadingStatus++;

				//替换html内容并显示
				parentBox = $("#functionFileList_Search");
				parentBox.html(data).css("display", "block");

				//绑定搜索栏内A标签的点击事件
				parentBox.find("a").click(function () {
					return BindFunction($(this));
				});

				parentBox.find(".functionFileTitle a").click(function () {
					$($(this).attr("href")).collapse('toggle')
				});

				//隐藏原有的文件列表
				$("#functionFileList").hide();
			},
			complete: function () {
				NProgress.done();
				$("#searchName").removeAttr("disabled");
				loadingStatus = 0;
			}
		});

		return false;
	});
})
.on("pjax:start", function () { NProgress.start(); })
.on("pjax:end", function () {
	//重新绑定displayBody下的a标签的事件
	$("#displayBody a").click(function () {
		return BindFunction($(this));
	});

	document.title = $("#subtitle").text();

	//语法着色
	Prism.highlightAll("code[class=language-cpp]");

	//消息气泡
	$('.glyphicon').popover(
	{
		container: 'body',
		placement: 'right',
		trigger: 'hover'
	});

	//结束载入动画
	NProgress.done();
	return;
})
.on("pjax:complete", function () {
	console.log("complete");
});

function CheckSwipe() {
	console.log("onresize");
	var element = $("body");

	if (element.width() < 768)
		element.removeClass("noSwipe");
	else
		element.addClass("noSwipe");
}

function BindFunction(ele) {
	if (ele == null)
		return;

	//console.log(ele);
	//console.log("Called.");

	var baseUrl = $("a#linkBaseUrl").attr("href");
	var dataHref = $(ele).attr("data-href");
	var href = $(ele).attr("href");

	if (RegExp("[a-zA-z]+://[^\s]*").test(href) || href == "#" || href == "javascript:void(0)") {
		return true;
	}

	var pageUrl = baseUrl + $(ele).attr(dataHref == null ? "href" : "data-href");
	$.pjax({ url: pageUrl, dataType: "html", container: "#displayBody", timeout: 8000 });

	if (dataHref == null)
		return false;
};

function FunctionListMenu(open) {
	if (open) {
		$(".divLeftSlider").addClass("divLeftSlider-Show");
		//$(".divMainBody").addClass("divMainBody-ShowLeft");
	}
	else {
		$(".divLeftSlider").removeClass("divLeftSlider-Show");
		//$(".divMainBody").removeClass("divMainBody-ShowLeft");
	}
}