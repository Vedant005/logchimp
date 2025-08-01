import type { Request, Response } from "express";
import type { TBoardUpdateBody } from "@logchimp/types";
import database from "../../../../database";

// utils
import logger from "../../../../utils/logger";
import error from "../../../../errorResponse.json";

export async function updateBoard(
  req: Request<unknown, unknown, TBoardUpdateBody>,
  res: Response,
) {
  // @ts-ignore
  const permissions = req.user.permissions;
  // @ts-ignore
  const boardId = req.board.boardId;

  const { name, url, color, view_voters, display } = req.body;

  const checkPermission = permissions.includes("board:update");
  if (!checkPermission) {
    return res.status(403).send({
      message: error.api.roles.notEnoughPermission,
      code: "NOT_ENOUGH_PERMISSION",
    });
  }

  if (!url) {
    return res.status(400).send({
      errors: [
        url
          ? ""
          : {
              message: error.api.boards.urlMissing,
              code: "BOARD_URL_MISSING",
            },
      ],
    });
  }

  const slimUrl = url.replace(/\W+/gi, "-").trim().toLowerCase();

  try {
    const boards = await database
      .update({
        name,
        url: slimUrl,
        color,
        view_voters,
        display,
        updatedAt: new Date().toJSON(),
      })
      .from("boards")
      .where({
        boardId,
      })
      .returning("*");

    const board = boards[0];

    res.status(200).send({ board });
  } catch (err) {
    logger.log({
      level: "error",
      message: err,
    });

    res.status(500).send({
      message: error.general.serverError,
      code: "SERVER_ERROR",
    });
  }
}
