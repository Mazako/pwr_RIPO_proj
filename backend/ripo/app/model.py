from pydantic import BaseModel


class MaskPosition(BaseModel):
    x: int
    y: int
    width: int
    height: int
