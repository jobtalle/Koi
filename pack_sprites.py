import json
import os

from os import walk
from subprocess import call

class PackAseprites():
    EXTENSION = ".aseprite"
    NAMING_FORMAT = "{title}_{frame}"
    
    @staticmethod
    def make_command(path, output_json, output_image):
        command =\
            "aseprite -b " + path +\
            " --data " + output_json +\
            " --sheet-pack --sheet " + output_image +\
            " --filename-format " + PackAseprites.NAMING_FORMAT
        
        return command
    
    @staticmethod
    def contains_sources(files):
        for file in files:
            if file.endswith(PackAseprites.EXTENSION):
                return True
        
        return False

    @staticmethod
    def format_frame(frame):
        return {
            "t": frame["duration"] * 0.001,
            "x": frame["frame"]["x"],
            "y": frame["frame"]["y"]
        }

    @staticmethod
    def format_json(file):
        formatted = {}

        with open(file, "r") as f:
            data = json.load(f)

            for frame in data["frames"]:
                if frame.endswith("_0"):
                    formatted[frame.split("_")[0]] = {
                        "w": data["frames"][frame]["sourceSize"]["w"],
                        "h": data["frames"][frame]["sourceSize"]["h"],
                        "frames": [PackAseprites.format_frame(data["frames"][frame])]
                    }
                else:
                    formatted[frame.split("_")[0]]["frames"].append(PackAseprites.format_frame(data["frames"][frame]))

        os.remove(file)

        with open(file, "w") as f:
            f.write("const sprites = ")
            json.dump(formatted, f, separators=(",", ":"))
            f.write(";")
    
    def __init__(self, directory):
        self._directory = directory
    
    def pack(self, output_json, output_image):
        directories = ""
        
        for (dir_path, dir_names, file_names) in walk(self._directory):
            if file_names:
                if not PackAseprites.contains_sources(file_names):
                    continue
                
                if len(directories) > 1:
                    directories += " "
                
                directories += dir_path + "/*" + PackAseprites.EXTENSION
        
        call(PackAseprites.make_command(directories, output_json, output_image), shell=True)

        PackAseprites.format_json(output_json)


PackAseprites("sprites").pack("sprites.js", "atlas.png")