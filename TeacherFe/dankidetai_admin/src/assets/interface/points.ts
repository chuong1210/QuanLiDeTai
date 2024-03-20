interface PointsType extends DefaultResponse {
    type: "gvhd" | "gvpb" | "hd";
    scores: number;
    msgv: string;
}
