CC			= gcc
CFLAGS	= -Wall -std=c99 -pedantic -g
SRCS 		:= $(wildcard src/*.c)

all: $(notdir $(SRCS:.c=))

%: src/%.c
	$(CC) $(CFLAGS) $^ -o bin/$@
