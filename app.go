package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"image/png"
	"log"
	"net/http"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.org/x/image/draw"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func ResizeImage(img image.Image, width int) image.Image {
	bounds := img.Bounds()
	height := (bounds.Dy() * width) / bounds.Dx()
	newImage := image.NewRGBA(image.Rect(0, 0, width, height))
	draw.CatmullRom.Scale(newImage, newImage.Bounds(), img, bounds, draw.Over, nil)
	return newImage
}

func (a *App) FetchImageAsBytes() []byte {
	path, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select an image",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Images (*.png;*.jpg)",
				Pattern:     "*.png;*.jpg",
			},
		},
	})
	if err != nil {
		log.Fatal(err)
		return nil
	}

	if path == "" {
		log.Print("No file selected.")
		return nil
	}

	bytes, err := os.ReadFile(path)
	if err != nil {
		log.Fatal(err)
		return nil
	}

	return bytes
}

func (a *App) EncodeImageToBase64(imageBytes []byte) string {
	var base64Encoding string

	mimeType := http.DetectContentType(imageBytes)

	switch mimeType {
	case "image/jpeg":
		base64Encoding += "data:image/jpeg;base64,"
	case "image/png":
		base64Encoding += "data:image/png;base64,"
	}

	// Append the base64 encoded output
	base64Encoding += base64.StdEncoding.EncodeToString(imageBytes)

	return base64Encoding
}

func (a *App) DecodeImage(imageBytes []byte) image.Image {
	var img image.Image
	var err error
	byteReader := bytes.NewReader(imageBytes)

	mimeType := http.DetectContentType(imageBytes)

	switch mimeType {
	case "image/jpeg":
		img, err = jpeg.Decode(byteReader)
	case "image/png":
		img, err = png.Decode(byteReader)
	}

	if err != nil {
		log.Fatal(err)
	}

	return img
}

func (a *App) ConvertImageToGrayscale(imageBytes []byte) []byte {
	img := a.DecodeImage(imageBytes)

	buf := new(bytes.Buffer)

	result := image.NewGray(img.Bounds())
	draw.Draw(result, result.Bounds(), img, img.Bounds().Min, draw.Src)

	jpeg.Encode(buf, result, nil)

	return buf.Bytes()
}

func (a *App) ConvertImageToAscii(imageBytes []byte) []string {
	const asciiChar string = "$@B%#*+=,. " //"$@B%#*+=,....."
	oldImage := a.DecodeImage(imageBytes)
	img := ResizeImage(oldImage, 80)

	result := make([]string, img.Bounds().Dy())

	for y := img.Bounds().Min.Y; y < img.Bounds().Max.Y; y++ {
		var line string
		for x := img.Bounds().Min.X; x < img.Bounds().Max.X; x++ {
			// pixelColor := img.At(x, y)
			// r, g, b, _ := pixelColor.RGBA()
			// pixelLuminance := a.calculateLuminance(r, g, b)
			pixelValue := color.GrayModel.Convert(img.At(x, y)).(color.Gray)
			pixel := pixelValue.Y
			asciiIndex := int(pixel) * (len(asciiChar) - 1) / 255
			line += string(asciiChar[asciiIndex])
		}

		result[y] = line
	}

	return result
}

func (a *App) PrintAscii(asciiRep []string) {
	for i := 0; i < len(asciiRep); i++ {
		fmt.Println(asciiRep[i])
	}
}

func (a *App) calculateLuminance(r, g, b uint32) uint8 {
	return uint8(0.2126*float64(r) + 0.7152*float64(g) + 0.0722*float64(b))
}
