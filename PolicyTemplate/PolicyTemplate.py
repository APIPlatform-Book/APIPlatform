#!/usr/bin/python
from __future__ import print_function
import sys, getopt, os
from shutil import copyfile
from shutil import copytree

SUBDIRS = ('bin', 'extLibs', '.settings', 'src')
USAGE = 'USAGE: python PolicyTemplate.py -t targetDirectory -p policyName -s sdk [-S|--style] [-h|--help]'
PARAMS = {"targetDir": '', "policyName": '', "sdk": ''}


class PTException(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return repr(self.value)


def usage():
    print(USAGE, file=sys.stderr)


def targetdir():
    return PARAMS['targetDir']


def policyname():
    return PARAMS['policyName']


def sdk():
    return PARAMS['sdk']


def checkParams():
    for k in PARAMS:
        if len(PARAMS[k]) == 0:
            raise PTException("Missing value for {0}".format(k))


def showHelp():
    print(USAGE)
    print('Target directory should not exist')
    print('Policy name should be any sequence of characters that are valid as part of a filename and a Java method')
    print('SDK should be the location (directory) of the custom policy SDK')


def createClasspath():
    with open(os.path.join(targetdir(), '.classpath'), 'w') as classpath:
        classpath.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        classpath.write('<classpath>\n')
        classpath.write('\t<classpathentry kind="src" path="src/config/java"/>\n')
        classpath.write('\t<classpathentry kind="src" path="src/runtime/java"/>\n')
        for jar in os.listdir(sdk()):
            path = os.path.join(sdk(), jar)
            classpath.write('\t<classpathentry kind="lib" path="{0}"/>\n'.format(path))
        classpath.write('\t<classpathentry kind="con" path="org.eclipse.jdt.launching.JRE_CONTAINER"/>\n')
        classpath.write('\t<classpathentry kind="output" path="bin"/>\n')
        classpath.write('</classpath>\n')


def dofilesubstitutions(filename, style):
    tmp = filename + '.tmp'
    with open(filename, 'r') as source:
        with open(tmp, 'w') as target:
            for line in source:
                if style:
                    line = line.replace('%%policyname%%', policyname().lower())
                    line = line.replace('%%POLICYNAME%%', policyname().upper())
                else:
                    line = line.replace('%%policyname%%', policyname())
                    line = line.replace('%%POLICYNAME%%', policyname())
                line = line.replace('%%SDK%%', sdk())
                target.write(line)
    os.remove(filename)
    os.rename(tmp, filename)


def changename(canonical, style):
    newname = None
    if style:
        if 'policyname' in canonical:
            newname = canonical.replace('policyname', policyname().lower())
        if 'POLICYNAME' in canonical:
            newname = canonical.replace('POLICYNAME', policyname().upper())
    else:
        if 'policyname' in canonical:
            newname = canonical.replace('policyname', policyname())
        if 'POLICYNAME' in canonical:
            newname = canonical.replace('POLICYNAME', policyname())
    if newname:
        os.rename(canonical, newname)


def navigate(style):
    #rename directories
    for root, dirs, files in os.walk(targetdir()):
        for d in dirs:
            canonical = os.path.join(root, d)
            changename(canonical, style)
    #rename files
    for root, dirs, files in os.walk(targetdir()):
        for f in files:
            canonical = os.path.join(root, f)
            changename(canonical, style)
    #do substitutions
    for root, dirs, files in os.walk(targetdir()):
        for f in files:
            dofilesubstitutions(os.path.join(root, f), style)


def main(argv):
    try:
        opts, args = getopt.getopt(argv, "t:p:s:hS", ["p=", "t=", "s=", "help", "style"])
    except getopt.GetoptError as err:
        print("Exception: {0} -- STOPPING".format(err), file=sys.stderr)
        return
    style = False
    for opt, arg in opts:
        if opt in ('-t', '--t'):
            PARAMS['targetDir'] = arg
        elif opt in ('-p', '--p'):
            PARAMS['policyName'] = arg
        elif opt in ('-s', '--s'):
            PARAMS['sdk'] = arg.replace('\\', '/')
        elif opt in ('-S', '--style'):
            style = True
        elif opt in('-h', '--help'):
            showHelp()
            return

    try:
        checkParams()
        if os.path.exists(targetdir()):
            raise PTException('Target directory already exists')
        for tree in ('.settings', 'bin', 'src', 'extLibs'):
            copytree(tree, os.path.join(targetdir(), tree))
        for f in ('.project', 'build.xml', 'build.properties'):
            copyfile(f, os.path.join(targetdir(), f))
        navigate(style)
        createClasspath()

    except Exception as e:
        print("Exception: {0} -- STOPPING".format(e), file=sys.stderr)
        return


if __name__ == "__main__":
    main(sys.argv[1:])