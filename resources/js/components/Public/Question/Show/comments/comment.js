import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

/**
 * コメント（個別）
 */
function Comment(props) {
    const history = useHistory();

    const deleteConfirm = () => {
        if (confirm("コメントが削除されます。\nよろしいですか？")) {
            props.setCommentChanging(true);

            axios
                .post(`/comments/${props.comment_id}/delete`)
                .then(response => {
                    if (response.status === 200) {
                        props.setCommentChanging(false);
                        history.push("/questions/" + response.data.id, {
                            comment: "deleted"
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            window.alert("キャンセルしました");
            return false;
        }
    };

    let comment = [];
    if (props.comment) {
        // 最後の文が認識されないのを防止する
        const text = props.comment + "\n";

        /**
         * step1 画像が含まれているか判別
         */

        // 画像が含まれていた場合は画像部分と文章部分を分割してstep1_fragmentsに格納
        let step1_fragments = [];

        // 画像が含まれていた場合
        if (text.indexOf("<image link=") !== -1) {
            // "<image link="という文字列で配列に分割
            let semi_fragments = text.split(/(?=<image link=)/g);

            // 画像部分を抽出
            semi_fragments.forEach(semi_fragment => {
                // "//>"という文字列があれば配列に分割して、なければそのままstep1_fragmentsに格納
                if (semi_fragment.indexOf("//>")) {
                    let fragments = semi_fragment.split("//>");

                    fragments.map(fragment => {
                        step1_fragments.push(fragment);
                    });
                } else {
                    step1_fragments.push(semi_fragment);
                }
            });
        } else {
            step1_fragments.push(text);
        }

        step1_fragments.map(fragment => {
            /**
             * step2 画像表示
             */

            // fragmentが画像の部分だった場合
            if (fragment.indexOf("<image link=") !== -1) {
                // 画像部分か判別するためにfragmentの冒頭につけている"<image link="の部分を削除し、画像のURLを取得
                let image_url = fragment.slice(12);

                comment.push(
                    <a href={image_url} data-lightbox="group">
                        <img src={image_url} height={200} width={200} />
                    </a>
                );

                // fragmentが文章だった場合
            } else {
                // コードブロックがある場合
                if (fragment.indexOf("```\n") !== -1) {
                    // " ```\n（改行） "の記号で文章全体を分割
                    // 以下分割した文章を”block（ブロック）”と呼称
                    const blocks = fragment.split("```\n");

                    blocks.forEach((block_content, block_number) => {
                        // ブロックに"\n（改行）"があった場合
                        if (blocks[block_number].indexOf("\n") !== -1) {
                            // ブロックを”\n（改行）”で分割
                            // 以下分割した各文を"paragraph（パラグラフ）"と呼称
                            const paragraphs = blocks[block_number].split("\n");

                            paragraphs.forEach(
                                (paragraph_content, paragraph_number) => {
                                    // パラグラフの先頭に"* （アスタリスクとスペース）"の記号が含まれてた場合
                                    if (
                                        paragraphs[paragraph_number].slice(
                                            0,
                                            2
                                        ) === "* "
                                    ) {
                                        // パラグラフの先頭の"* "を"・"に置き換え
                                        paragraphs[paragraph_number] =
                                            "・" + paragraph_content.slice(2);
                                    }
                                }
                            );

                            // 箇条書きのために分解したブロックを再構成
                            // "\n"で連結
                            blocks[block_number] = paragraphs.join("\n");
                        }
                    });

                    // 表示内容の設定
                    comment.push(
                        blocks.map((block, block_number) => {
                            // コードブロック以外
                            if (block_number % 2 === 0) {
                                return <div key={block_number}>{block}</div>;

                                // コードブロック
                            } else {
                                return (
                                    <Typography
                                        key={block_number}
                                        component="div"
                                        sx={{
                                            width: "90%",
                                            marginLeft: "5%",
                                            marginTop: 1,
                                            marginBottom: 1,
                                            padding: 2,
                                            backgroundColor: "#DDDDDD",
                                            borderRadius: "3px"
                                        }}
                                    >
                                        {block}
                                    </Typography>
                                );
                            }
                        })
                    );

                    // コードブロックがなく箇条書きがある場合
                } else if (fragment.indexOf("\n") !== -1) {
                    // ブロックを”\n（改行）”で分割
                    // 以下分割した各文を"paragraph（パラグラフ）"と呼称
                    const paragraphs = fragment.split("\n");

                    paragraphs.forEach(
                        (paragraph_content, paragraph_number) => {
                            // パラグラフの先頭に"* （アスタリスクとスペース）"の記号が含まれてた場合
                            if (
                                paragraphs[paragraph_number].slice(0, 2) ===
                                "* "
                            ) {
                                // パラグラフの先頭の"* "を"・"に置き換え
                                paragraphs[paragraph_number] =
                                    "・" + paragraph_content.slice(2);
                            }
                        }
                    );

                    // 表示内容の設定
                    // パラグラフは元々改行で区切られていた文章なのでdivタグにそのまま挿入
                    comment.push(
                        paragraphs.map((paragraph, paragraph_number) => {
                            return (
                                <div key={paragraph_number}>{paragraph}</div>
                            );
                        })
                    );

                    // 特にデザインがない場合
                } else {
                    // 表示内容の設定
                    // 入力内容をそのまま挿入
                    comment.push(<div>{fragment}</div>);
                }
            }
        });
    }

    return (
        <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Grid container spacing={2} justifyContent="left">
                    <Grid item>
                        {props.is_staff ? (
                            <Avatar
                                alt="Mentor"
                                src="/images/images.jpg"
                                sx={{
                                    marginTop: 3,
                                    marginLeft: 3,
                                    float: "left"
                                }}
                            />
                        ) : (
                            <Avatar
                                alt="Student"
                                src="/images/pose_english_shrug_man.png"
                                sx={{
                                    marginTop: 3,
                                    marginLeft: 3
                                }}
                            />
                        )}
                    </Grid>

                    <Grid item sx={{ marginTop: 4 }}>
                        <Typography variant="h7" component="div">
                            {props.is_staff ? "メンター" : "受講生"} &nbsp;
                            {props.created_at}
                        </Typography>
                    </Grid>
                </Grid>

                {(props.user_id === props.target_student ||
                    props.is_admin === "staff") && (
                    <Grid
                        container
                        justifyContent="right"
                        alignItems="center"
                        sx={{ marginTop: 1 }}
                    >
                        <Grid item>
                            <Button
                                variant="text"
                                color="secondary"
                                onClick={() =>
                                    props.setEditId(props.comment_id)
                                }
                            >
                                編集
                            </Button>
                        </Grid>

                        <Grid item>/</Grid>

                        <Grid item>
                            <Button
                                variant="text"
                                color="secondary"
                                onClick={deleteConfirm}
                            >
                                削除
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Box>
            <Typography
                variant="h6"
                component="div"
                sx={{
                    paddingTop: 2,
                    marginLeft: 4,
                    marginBottom: 2,
                    marginRight: 2,
                    clear: "left"
                }}
            >
                {comment}
            </Typography>
        </React.Fragment>
    );
}

export default Comment;
