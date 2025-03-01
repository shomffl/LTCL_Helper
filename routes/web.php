<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// registerページのデフォルトルーティングを無効化
// registerは下部で個別に定義
Auth::routes([
    'register' => false,
    'reset' => false,
]);

// ユーザーロックアウト画面
Route::get('/lockout', 'Auth\LoginController@lockout');

/**
 * コメントアウトしているルーティングはReact Routerに移行したので
 * resources/js/components/Route.js
 * を確認してください
 */
Route::group(['middleware' => ['auth']], function () {

    /**
     * ログイン済みユーザーのみアクセス可能
     */
    Route::post('/questions/store', 'QuestionController@store'); // 新規作成実行
    Route::post('/questions/image/store', 'QuestionController@imageStore'); // 質問の画像保存処理
    Route::post('/questions/{question}/record', 'QuestionController@recordShow'); // 質問詳細画面のユーザ閲覧履歴記録処理
    Route::post('/questions/{question}/resolved', 'QuestionController@resolved'); // 質問のステータス変更処理(質問解決)
    Route::post('/comments/store', 'CommentController@store'); // 質問へのコメント保存処理
    Route::post('/comments/{comment}/update', 'CommentController@update'); // 質問へのコメント更新処理
    Route::post('/comments/{comment}/delete', 'CommentController@delete'); // 質問へのコメント削除処理
    Route::post('/contact', 'ContactController@sendContactMessage'); // お問い合わせ内容送信処理
    // Route::get('/', 'HomeController@home'); // トップ画面表示
    // Route::get('/search/condition', 'SearchController@search'); // 絞り込み検索画面表示
    // Route::get('/questions/index/public', 'QuestionController@publicIndex'); // 公開中の質問一覧表示
    // Route::get('/questions/create/public', 'QuestionController@publicCreate'); // 受講生の質問投稿画面表示
    // Route::get('/questions/{question}/public', 'QuestionController@publicShow'); // 質問詳細画面表示
    // Route::get('/documents/index/public', 'DocumentController@publicIndex'); // 公開中の参考記事一覧表示
    // Route::get('/history', 'HomeController@history'); // 履歴画面表示
    // Route::get('/contact/create', 'ContactController@create'); // お問い合わせ画面表示


    /**
     * 以下のurlはreact上で非同期通信として利用
     */
    Route::get('react/history', 'HomeController@getHistory'); // ログインユーザの閲覧した質問のデータ受け渡し
    Route::get('react/question/mypage/{question}', 'ReactController@getMyQuestion'); // 公開中の個別質問データの受け渡し
    Route::get('react/question/checked/{question}', 'ReactController@getCheckedQuestion'); // 公開中の個別質問データの受け渡し
    Route::get('react/questions/checked', 'ReactController@getCheckedQuestions'); // 公開中の質問受け渡し
    Route::get('react/questions/search', 'ReactController@getSearchQuestions'); // 質問検索結果の受け渡し
    Route::get('react/questions/search/paginate', 'ReactController@getSearchQuestionsPaginate'); // 質問検索結果の受け渡しのペじネーション
    Route::get('react/questions/mine', 'ReactController@getMyQuestions'); // ログインユーザの質問一覧受け渡し
    Route::get('react/documents/all', 'ReactController@getAllDocuments'); // 全記事受け渡し
    Route::get('react/documents/related/{question}', 'ReactController@getRelatedDocuments'); // 質問に紐づいている記事の受け渡し
    Route::get('react/documents/related/paginate/{category}', 'ReactController@getRelatedDocumentsPaginate'); // カテゴリーに紐づいている記事の受け渡し
    Route::get('react/user', 'ReactController@getUser'); // ログインユーザー受け渡し
    Route::get('react/weather', 'ReactController@getWeather'); // 今日の天気のデータ受け渡し
    Route::get('react/college/{year}/{month}/{date}', 'ReactController@getCollegeData'); // 校舎に関するデータ受け渡し
    Route::get('react/infos', 'ReactController@getInfos'); // お知らせのデータ受け渡し
    Route::get('react/home', 'ReactController@getHomeData'); // Google Map APIのAPIキーとzoomリンク一覧ページへのurl受け渡し
    Route::get('react/index', 'ReactController@getQuestionArticle'); // Google Map APIのAPIキーとzoomリンク一覧ページへのurl受け渡し
    // Route::get('react/images/{question_id}', 'ReactController@getImages'); // 質問に関連する画像の受け渡し


    /**
     *  管理者権限を持っているユーザーのみがアクセス可能
     */
    Route::group(['middleware' => ['administrator']], function () {

        /**
         *  トップ画面
         */
        Route::post('/informations/store', 'HomeController@storeInfo'); // お知らせの登録
        Route::post('/informations/{info}/delete', 'HomeController@deleteInfo'); // お知らせの削除


        /**
         * 管理画面表示
         */
        // Route::get('/mentor', 'HomeController@mentorTop'); // メンター管理画面表示


        /**
         * 参考記事
         */
        Route::post('/documents/store', 'DocumentController@store'); // 新規作成実行
        Route::post('/documents/{document}/update', 'DocumentController@update'); // 編集実行
        Route::post('/documents/{document}/delete','DocumentController@delete'); // 削除実行
        // Route::get('/documents/index', 'DocumentController@index'); // 初期画面表示
        // Route::get('/documents/create', 'DocumentController@create'); // 新規作成画面表示
        // Route::get('/documents/{document}', 'DocumentController@show'); // 詳細画面表示
        // Route::get('/documents/{document}/edit', 'DocumentController@edit'); // 編集画面表示


        /**
         * 質問と参考記事の紐付け
         */
        Route::post('/links/document/{document}', 'LinkController@linkQuestionsFromDocument'); // 紐付け実行(記事：質問＝１：多)
        Route::post('/links/question/{question}', 'LinkController@linkDocumentsFromQuestion'); // 紐付け実行(記事：質問＝多：1)
        // Route::get('/links/index', 'LinkController@index'); // 初期画面表示
        // Route::get('/links/document/{document}', 'LinkController@getDocumentToQuestions'); // 新規作成画面表示(記事：質問＝１：多)
        // Route::get('/links/question/{question}', 'LinkController@getQuestionToDocuments'); // 新規作成画面表示(記事：質問＝多：1)


        /**
         * 質問
         */
        Route::get('/questions/export', 'QuestionController@questionsExport');
        Route::post('/questions/backup', 'QuestionController@backup'); // 質問一括登録（バックアップ復元用）
        Route::post('/questions/{question}/check', 'QuestionController@check'); // 承認実行
        Route::post('/questions/{question}/uncheck', 'QuestionController@uncheck'); // 承認解除実行
        Route::post('/questions/{question}/update', 'QuestionController@update'); // 編集実行
        Route::post('/questions/{question}/delete', 'QuestionController@delete'); // 削除実行
        // Route::get('/questions/index', 'QuestionController@index'); // 初期画面表示
        // Route::get('/questions/create', 'QuestionController@create'); // 新規作成画面表示
        // Route::get('/questions/{question}', 'QuestionController@show'); // 詳細画面表示
        // Route::get('/questions/{question}/edit', 'QuestionController@edit'); // 編集画面表示


        /**
         * ユーザー
         */
        Route::post('/users/backup', 'UserController@backup'); // 受講生一括登録（バックアップ復元用）
        Route::post('/users/public/register', 'Auth\RegisterController@publicRegister'); // 受講生の新規作成実行
        Route::post('/users/admin/register', 'Auth\RegisterController@register'); // 管理者の新規作成実行
        Route::post('/users/{user}/delete', 'UserController@delete'); // 削除実行
        Route::post('/users/{user}/unlock', 'UserController@unlock'); // ユーザロック解除実行
        // Route::get('/users/sheets', 'UserController@getSheets');
        // Route::get('/users/index', 'UserController@index'); // 初期画面表示
        // Route::get('users/admin/register', 'Auth\RegisterController@showRegistrationForm')->name('register'); // 管理者の新規作成画面表示
        // Route::get('/users/public/register', 'Auth\RegisterController@showPublicRegistrationForm'); // 受講生の新規作成画面表示

        /**
         * イベント
         */
        Route::post('/events/store', 'HomeController@storeEvent'); // イベントの新規作成実行
        Route::post('/events/{event}/update', 'HomeController@updateEvent'); // イベントの編集
        Route::post('/events/{event}/delete', 'HomeController@deleteEvent'); // イベントの編集

        /**
         * Reactでのデータ受け渡し（全て非同期）
         */
        Route::get('react/all/questions', 'ReactController@getAllQuestions'); // 全質問受け渡し
        Route::get('react/question/{question}', 'ReactController@getQuestion'); // 個別質問データの受け渡し
        Route::get('react/questions/counts', 'ReactController@getQuestionYetCounts'); // 未解決でメンターまたは受講生のコメント入力待ちの件数受け渡し
        Route::get('react/questions/curriculum', 'ReactController@getCurriculumQuestions'); // カリキュラム範囲の質問受け渡し
        Route::get('react/questions/portfolio', 'ReactController@getPortfolioQuestions'); // 成果物範囲の質問受け渡し
        Route::get('react/questions/{document}', 'LinkController@getQuestionsFromDocument'); // 単体記事に関する質問データの受け渡し
        Route::get('react/questions/mentor_yet/{category}', 'ReactController@getMentorYetCommentQuestions'); // カテゴリーに応じたメンターコメント待ちの質問受け渡し
        Route::get('react/questions/student_yet/{category}', 'ReactController@getStudentYetCommentQuestions'); // カテゴリーに応じた受講生コメント待ちの質問受け渡し
        Route::get('react/document/{document}', 'ReactController@getDocument'); // 個別記事データの受け渡し
        Route::get('react/documents/{question}', 'LinkController@getDocumentsFromQuestion'); // 単体質問に関する記事データの受け渡し
        Route::get('react/related/questions/{document}', 'ReactController@getRelatedQuestions'); // 記事に紐づいている質問の受け渡し（URLが紛らわしい）
        Route::get('react/all/staffs', 'ReactController@getAllStaffs'); // 全管理者受け渡し
        Route::get('react/all/students', 'ReactController@getAllStudents'); // 全受講生受け渡し
        Route::get('react/events', 'ReactController@getAllEvents'); // イベントの受け渡し
        Route::get('react/event/{event}', 'ReactController@getOneEvent'); // イベントの受け渡し
        Route::get('react/reaction', 'ReactController@getReaction'); // slackのリアクション参考サイトのURL受け渡し
        Route::get('react/id', 'ReactController@getUserId'); // ログインユーザーid受け渡し
        // Route::get('react/unapproved/questions', 'ReactController@getUnapprovedQuestions'); // 未承認質問受け渡し（未使用？）
    });

    Route::get('/{any}', function(){
        return view('react');
    })->where('any', '.*');
});

